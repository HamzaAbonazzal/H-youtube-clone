import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchVideos, getShortsVideos } from '../api/youtube';
import { VideoCard } from '../components/video/VideoCard';
import { CategoryBar } from '../components/common/CategoryBar';
import { ShortsRow } from '../components/shorts/ShortsRow';
import { Link } from 'react-router-dom';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showShorts, setShowShorts] = useState(true);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['homeVideos', selectedCategory],
    queryFn: async ({ pageParam }) => {
      let res;
      if (selectedCategory === 'All') {
        // استعلام مزيج يضمن جلب فيديوهات عربية وأجنبية متنوعة بدون انقطاع
        const homeQuery = 'ثقافة ترفيه تجارب وثائقيات trending news entertainment';
        res = await searchVideos(homeQuery, pageParam as string | undefined);
      } else if (selectedCategory === 'Shorts') {
        res = await getShortsVideos(pageParam as string | undefined);
        return {
          items: res.items || [],
          nextPageToken: res.nextPageToken,
        };
      } else {
        res = await searchVideos(selectedCategory, pageParam as string | undefined);
      }

      const itemsList = Array.isArray(res) ? res : (res?.items || []);
      const token = Array.isArray(res) ? undefined : res?.nextPageToken;

      return {
        items: shuffleArray(itemsList),
        nextPageToken: token,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 600 >=
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

  const firstBatch = allVideos.slice(0, 8);
  const remainingBatch = allVideos.slice(8);

  return (
    <div className="w-full max-w-[2200px] mx-auto pb-12">
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="p-3 sm:p-4 md:p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-3">
                <div className="bg-slate-200 dark:bg-slate-800 aspect-video rounded-xl" />
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-64 text-red-500 font-medium text-center px-4">
            Failed to load videos. Please check your API Quota or Connection.
          </div>
        ) : (
          <>
            {selectedCategory === 'Shorts' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-3 sm:gap-4">
                {allVideos.map((video, idx) => {
                  const videoId =
                    typeof video.id === 'string' ? video.id : video.id?.videoId;
                  const snippet = video.snippet;

                  return (
                    <Link
                      key={`${videoId}-${idx}`}
                      to="/shorts"
                      className="flex flex-col gap-2 group cursor-pointer"
                    >
                      <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-200 dark:bg-[#131f37] border border-slate-200/50 dark:border-slate-800">
                        <img
                          src={snippet?.thumbnails?.high?.url || snippet?.thumbnails?.medium?.url}
                          alt={snippet?.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                      </div>

                      <div className="px-1">
                        <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 leading-snug text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors">
                          {snippet?.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                          {snippet?.channelTitle}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-6 sm:gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-6">
                  {firstBatch.map((video, idx) => {
                    const videoId =
                      typeof video.id === 'string' ? video.id : video.id?.videoId;
                    return <VideoCard key={`${videoId}-${idx}`} video={video} />;
                  })}
                </div>

                {showShorts && selectedCategory === 'All' && (
                  <div className="my-2 sm:my-4">
                    <ShortsRow onDismiss={() => setShowShorts(false)} />
                  </div>
                )}

                {remainingBatch.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-6">
                    {remainingBatch.map((video, idx) => {
                      const videoId =
                        typeof video.id === 'string' ? video.id : video.id?.videoId;
                      return <VideoCard key={`${videoId}-${idx + 8}`} video={video} />;
                    })}
                  </div>
                )}
              </div>
            )}

            {isFetchingNextPage && (
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};