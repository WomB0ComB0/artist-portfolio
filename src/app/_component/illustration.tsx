'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useState, useRef } from 'react';
import { Maximize, X, Download, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Slide } from '@/components';

interface IllustrationProps {
  title?: string;
  description?: string;
  file_path: string;
}

const urlCache = new Map<string, string>();

export function Illustration({ title, description, file_path }: IllustrationProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const supabase = createClient();
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const getImageUrl = useCallback(
    async (filePath: string) => {
      if (!filePath) {
        console.error('No file path provided');
        return null;
      }

      if (urlCache.has(filePath)) {
        return urlCache.get(filePath)!;
      }

      const cleanPath = filePath.replace(/^uploads\//, '');

      try {
        const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(cleanPath);

        if (publicData?.publicUrl) {
          const response = await fetch(publicData.publicUrl, { method: 'HEAD' }).catch(() => ({
            ok: false,
          }));

          if (response.ok) {
            urlCache.set(filePath, publicData.publicUrl);
            return publicData.publicUrl;
          }
        }

        const { data: signedData, error: signedError } = await supabase.storage
          .from('uploads')
          .createSignedUrl(cleanPath, 3600);

        if (signedError) {
          console.error('Error generating signed URL:', signedError);
          throw signedError;
        }

        if (!signedData?.signedUrl) {
          throw new Error('No signed URL generated');
        }

        urlCache.set(filePath, signedData.signedUrl);
        return signedData.signedUrl;
      } catch (error) {
        console.error('Error getting image URL:', error);
        throw error;
      }
    },
    [supabase],
  );

  useEffect(() => {
    let mounted = true;

    const fetchImage = async () => {
      if (!file_path) {
        setError('No file path provided');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const url = await getImageUrl(file_path);
        if (mounted && url) {
          setImageUrl(url);
        }
      } catch (err) {
        if (mounted) {
          console.error('Error in fetchImage:', err);
          setError('Failed to load image');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      mounted = false;
    };
  }, [file_path, getImageUrl]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      fullscreenRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleDownload = useCallback(async () => {
    if (imageUrl) {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${title || 'illustration'}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }, [imageUrl, title]);

  const handleZoomIn = useCallback(() => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prevZoom) => {
      const newZoom = Math.max(prevZoom - 0.1, 1);
      if (newZoom === 1) {
        // Reset pan position when zooming out to 1
        x.set(0);
        y.set(0);
      }
      return newZoom;
    });
  }, [x, y]);

  const handlePanStart = useCallback(() => {
    if (zoom > 1) {
      setIsPanning(true);
    }
  }, [zoom]);

  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handlePan = useCallback(
    (event: React.PointerEvent<HTMLDivElement>, info: { offset: { x: number; y: number } }) => {
      if (isPanning && imageRef.current && containerRef.current) {
        const imageWidth = imageRef.current.offsetWidth * zoom;
        const imageHeight = imageRef.current.offsetHeight * zoom;
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        const maxX = Math.max(0, (imageWidth - containerWidth) / 2);
        const maxY = Math.max(0, (imageHeight - containerHeight) / 2);

        const newX = x.get() + info.offset.x;
        const newY = y.get() + info.offset.y;

        x.set(Math.max(-maxX, Math.min(maxX, newX)));
        y.set(Math.max(-maxY, Math.min(maxY, newY)));
      }
    },
    [isPanning, zoom, x, y],
  );

  const constrainedX = useTransform(x, (latest) => {
    if (!imageRef.current || !containerRef.current) return latest;
    const imageWidth = imageRef.current.offsetWidth * zoom;
    const containerWidth = containerRef.current.offsetWidth;
    const maxX = Math.max(0, (imageWidth - containerWidth) / 2);
    return Math.max(-maxX, Math.min(maxX, latest));
  });

  const constrainedY = useTransform(y, (latest) => {
    if (!imageRef.current || !containerRef.current) return latest;
    const imageHeight = imageRef.current.offsetHeight * zoom;
    const containerHeight = containerRef.current.offsetHeight;
    const maxY = Math.max(0, (imageHeight - containerHeight) / 2);
    return Math.max(-maxY, Math.min(maxY, latest));
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col"
    >
      <div
        ref={fullscreenRef}
        className={cn(
          "flex-grow relative min-h-[200px] mb-4 rounded-lg overflow-hidden shadow-lg",
          isFullscreen && "fixed inset-0 z-50 bg-black"
        )}
      >
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : error ? (
          <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-red-500">
            {error}
          </div>
        ) : imageUrl ? (
          <motion.picture
            ref={containerRef}
            className={cn("w-full h-full select-none", zoom > 1 && "cursor-move")}
            onPointerDown={handlePanStart}
            onPointerUp={handlePanEnd}
            onPointerLeave={handlePanEnd}
            onPointerMove={(event) => handlePan(event as React.PointerEvent<HTMLDivElement>, { offset: { x: event.movementX, y: event.movementY } })}
          >
            <>
              <source src={imageUrl} type="image/png" />
              <source src={imageUrl} type="image/jpeg" />
              <motion.img
                ref={imageRef}
                src={imageUrl}
                alt={title || 'Illustration'}
                className="object-contain w-full h-full transition-opacity duration-300"
                style={{
                  scale: zoom,
                  x: constrainedX,
                  y: constrainedY,
                }}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  console.error(`Error loading image: ${file_path}`);
                  setError('Failed to load image');
                }}
              />
            </>
          </motion.picture>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Image
              src="/assets/svgs/placeholder.svg"
              alt="Placeholder"
              className="object-contain max-w-full max-h-full"
              width={200}
              height={200}
              loading="eager"
            />
          </div>
        )}
        <AnimatePresence>
          {imageUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 right-2 flex space-x-2"
            >
              <Button size="sm" variant="secondary" onClick={toggleFullscreen}>
                <Maximize className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" onClick={handleZoomOut} disabled={zoom === 1}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              {isFullscreen && (
                <Button size="sm" variant="secondary" onClick={toggleFullscreen}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <article className="flex-shrink-0">
        <Slide>
          <h2>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold line-clamp-2">
            {title}
          </h3>
        </h2>
        </Slide>
        <Slide>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </Slide>
      </article>
    </motion.div>
  );
}
