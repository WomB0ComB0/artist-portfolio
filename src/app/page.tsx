'use client';

import BlurFade from '@/components/ui/blur-fade';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/utils';
import { api } from '@/utils/api';
import { fileExists } from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Illustration {
  id: string;
  file_path: string;
  title: string;
  image_url?: string;
}

interface ApiResponse {
  items: Illustration[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

const urlCache = new Map<string, string>();

const AsyncImage = ({
  src,
  alt,
  ...props
}: { src: Promise<string>; alt: string; [key: string]: any }) => {
  const [imageSrc, setImageSrc] = useState<string>('/assets/svgs/placeholder.svg');

  useEffect(() => {
    src.then(setImageSrc);
  }, [src]);

  return <Image src={imageSrc} alt={alt} {...props} />;
};

export default function Home() {
  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const supabase = createClient();
  const observerTarget = useRef(null);
  const initialFetchDone = useRef(false);

  const getImageUrl = useCallback(
    async (filePath: string) => {
      if (!filePath) {
        console.warn('Empty file path provided');
        return '/assets/svgs/placeholder.svg';
      }

      if (urlCache.has(filePath)) {
        return urlCache.get(filePath)!;
      }

      const cleanPath = filePath.replace(/^uploads\//, '').replace(/^illustrations\//, '');

      try {
        const exists = await fileExists(cleanPath);
        if (!exists) {
          console.warn(`File does not exist: ${cleanPath}`);
          return '/assets/svgs/placeholder.svg';
        }

        const { data, error } = await supabase.storage
          .from('uploads')
          .createSignedUrl(`illustrations/${cleanPath}`, 60 * 60);

        if (error) {
          console.error('Error generating signed URL:', error.message);
          return '/assets/svgs/placeholder.svg';
        }

        if (!data || !data.signedUrl) {
          console.error('No signed URL returned from Supabase');
          return '/assets/svgs/placeholder.svg';
        }

        urlCache.set(filePath, data.signedUrl);
        return data.signedUrl;
      } catch (err) {
        console.error('Unexpected error in getImageUrl:', err);
        return '/assets/svgs/placeholder.svg';
      }
    },
    [supabase],
  );

  const fetchIllustrations = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = (await api(
        `/api/illustrations?page=${currentPage}&limit=9&sortBy=created_at&sortDirection=desc`,
      )) as ApiResponse;

      const newIllustrations = response.items.filter(
        (newIllus) => !illustrations.some((prevIllus) => prevIllus.id === newIllus.id),
      );

      setIllustrations((prev) => [...prev, ...newIllustrations]);
      setCurrentPage((prev) => prev + 1);
      setHasMore(response.currentPage < response.totalPages);
    } catch (err) {
      console.error('Error fetching illustrations:', err);
      setError(
        err instanceof Error ? err.message : 'An error occurred while fetching illustrations',
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading, hasMore, illustrations]);

  const debouncedFetchIllustrations = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fetchIllustrations();
      }, 200);
    };
  }, [fetchIllustrations]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchIllustrations();
      initialFetchDone.current = true;
    }
  }, [fetchIllustrations]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          debouncedFetchIllustrations();
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [debouncedFetchIllustrations, loading, hasMore]);

  const processedIllustrations = useMemo(() => {
    return illustrations.map((illustration) => ({
      ...illustration,
      image_url: illustration.file_path
        ? getImageUrl(illustration.file_path)
        : Promise.resolve('/assets/svgs/placeholder.svg'),
    }));
  }, [illustrations, getImageUrl]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 sr-only">
        Illustrations Gallery
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedIllustrations.map(({ id, title, image_url }, index) => (
          <BlurFade key={id} delay={index * 0.1}>
            <Link href={`/illustrations/${id}`} as={`/illustrations/${id}`} scroll={false}>
              <Card className="overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative h-64 w-full">
                    <AsyncImage
                      src={image_url}
                      alt={title.toLowerCase()}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-t-lg object-cover"
                      priority
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end justify-start p-4 transition-opacity opacity-0 hover:opacity-100">
                      <h3 className="text-white text-lg font-semibold">{title}</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </BlurFade>
        ))}
      </div>
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(9)].map((_, index) => (
            <BlurFade key={index} delay={index * 0.1}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-64 w-full">
                    <Skeleton className="h-full w-full rounded-t-lg" />
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>
      )}
      {hasMore && <div ref={observerTarget} className="h-10 w-full" />}
      {!hasMore && illustrations.length > 0 && (
        <p className="text-center text-gray-500 mt-8">No more illustrations to load.</p>
      )}
      {!hasMore && illustrations.length === 0 && (
        <p className="text-center text-gray-500 text-lg">No illustrations found.</p>
      )}
    </div>
  );
}
