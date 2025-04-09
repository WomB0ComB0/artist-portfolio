'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Maximize, X, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

interface IllustrationProps {
  id: string;
  title: string;
  description: string;
  file_path: string;
}

const urlCache = new Map<string, string>();

export function Modal({ illustration }: { illustration: IllustrationProps }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const getImageUrl = useCallback(
    async (filePath: string) => {
      if (!filePath) return '';

      if (urlCache.has(filePath)) {
        return urlCache.get(filePath)!;
      }

      const cleanPath = filePath.replace(/^uploads\//, '');
      const { data, error } = await supabase.storage
        .from('uploads')
        .createSignedUrl(cleanPath, 60 * 60);

      if (error) {
        console.error('Error generating signed URL:', error);
        return '';
      }

      urlCache.set(filePath, data.signedUrl);
      return data.signedUrl;
    },
    [supabase],
  );

  useEffect(() => {
    setIsOpen(true);
    setIsLoading(true);
    setError(null);
    getImageUrl(illustration.file_path)
      .then((url) => {
        setImageUrl(url);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching image URL:', err);
        setError('Failed to load image');
        setIsLoading(false);
      });
  }, [illustration.file_path, getImageUrl]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => router.back(), 300);
  }, [router]);

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${illustration.title}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }, [imageUrl, illustration.title]);

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

  const modalContent = useMemo(
    () => (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg w-full max-w-[95vw] sm:max-w-4xl relative shadow-2xl overflow-y-auto max-h-[95vh]"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg sm:text-xl md:text-3xl font-bold pr-12 sm:pr-0 text-gray-800 dark:text-gray-200 mb-2 sm:mb-0">
            {illustration.title}
          </h2>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              onClick={() => window.location.reload()}
            >
              <Eye size={18} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">View</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Maximize size={18} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Download size={18} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X size={18} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Close</span>
            </Button> */}
          </div>
        </div>
        <div
          ref={fullscreenRef}
          className={`relative ${isFullscreen ? 'h-screen' : 'h-[50vh] sm:h-[60vh] md:h-[70vh]'
            } w-full mb-4 sm:mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden`}
        >
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : (
            <Image
              src={imageUrl}
              alt={illustration.title}
              fill
              sizes="(max-width: 640px) 95vw, (max-width: 768px) 80vw, 70vw"
              className="object-contain rounded-lg select-none"
              priority
              loading="eager"
              onError={() => {
                console.error(`Error loading image: ${illustration.file_path}`);
                setError('Failed to load image');
              }}
            />
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed text-center prose truncate">
          {illustration.description}
        </p>
      </motion.div>
    ),
    [
      illustration,
      isLoading,
      error,
      imageUrl,
      handleClose,
      handleDownload,
      toggleFullscreen,
      isFullscreen,
    ],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-2 sm:p-4"
        >
          {modalContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
