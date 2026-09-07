import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchVideos } from '../api/youtube';
import { VideoCard } from '../components/video/VideoCard';
import {useTranslation} from 'react-i18next';

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { t } = useTranslation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['searchVideos', query],
    queryFn: ({ pageParam }) => searchVideos(query, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    enabled: !!query,
    staleTime: 1000 * 60 * 10,
  });

  // التقاط التمرير للأسفل لجلب دفعة نتائج جديدة
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 300 >=
        document.documentElement.offsetHeight
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allVideos = data?.pages.flatMap((page) => page.items) || [];

  if (!query) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        Please enter a search term.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-2">
            <div className="bg-slate-300 dark:bg-neutral-800 aspect-video rounded-xl" />
            <div className="h-4 bg-slate-300 dark:bg-neutral-800 rounded w-3/4" />
            <div className="h-3 bg-slate-300 dark:bg-neutral-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500 font-medium">
        {t("failed_fetch")}
      </div>
    );
  }

  if (allVideos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        {t("no_result")}: "{query}".
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {t("search_result")}: <span className="text-blue-500">{query}</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allVideos.map((video, idx) => {
          const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
          return <VideoCard key={`${videoId}-${idx}`} video={video} />;
        })}
      </div>

      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};