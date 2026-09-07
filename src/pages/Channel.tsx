import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getChannelDetails, getChannelVideos } from '../api/youtube';
import { formatViews } from '../utils/formatters';
import { VideoCard } from '../components/video/VideoCard';
import { Bell, CheckCircle } from 'lucide-react';

export const Channel: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const [activeTab, setActiveTab] = useState<'videos' | 'about'>('videos');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // 1. جلب تفاصيل القناة
  const { data: channel, isLoading: isChannelLoading } = useQuery({
    queryKey: ['channelDetails', channelId],
    queryFn: () => getChannelDetails(channelId!),
    enabled: !!channelId,
  });

  // 2. جلب فيديوهات القناة مع Infinite Scroll
  const {
    data: videosData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isVideosLoading,
  } = useInfiniteQuery({
    queryKey: ['channelVideos', channelId],
    queryFn: ({ pageParam }) => getChannelVideos(channelId!, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    initialPageParam: '',
    enabled: !!channelId,
  });

  if (isChannelLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!channel) return <div className="p-6 text-center">Channel not found</div>;

  const snippet = channel.snippet;
  const statistics = channel.statistics;
  const branding = channel.brandingSettings;
  const bannerUrl = branding?.image?.bannerExternalUrl;

  return (
    <div className="min-h-screen pb-10">
      {/* 1. غلاف القناة Banner */}
      {bannerUrl ? (
        <div className="w-full h-32 sm:h-52 md:h-64 lg:h-80 overflow-hidden bg-slate-200 dark:bg-[#131f37]">
          <img
            src={bannerUrl}
            alt="Channel Banner"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-32 sm:h-48 bg-gradient-to-r from-blue-900 to-slate-900"></div>
      )}

      {/* 2. رأس القناة (معلومات القناة والزر) */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <img
              src={snippet.thumbnails.high?.url || snippet.thumbnails.default?.url}
              alt={snippet.title}
              className="w-20 h-20 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {snippet.title}
                </h1>
                <CheckCircle className="w-5 h-5 text-slate-500 fill-slate-500 dark:text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                {snippet.customUrl || `@${snippet.title.replace(/\s+/g, '').toLowerCase()}`} •{' '}
                {formatViews(statistics?.subscriberCount || '0')} subscribers •{' '}
                {formatViews(statistics?.videoCount || '0')} videos
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 max-w-2xl">
                {snippet.description}
              </p>
            </div>
          </div>

          {/* زر الاشتراك */}
          <button
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
              isSubscribed
                ? 'bg-slate-200 dark:bg-[#131f37] text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-[#1c2d52]'
                : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200'
            }`}
          >
            {isSubscribed ? (
              <>
                <Bell className="w-4 h-4 fill-current" />
                <span>Subscribed</span>
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </div>

        {/* 3. تبويبات القناة Navigation Tabs */}
        <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800 mt-2 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 relative transition-colors ${
              activeTab === 'videos'
                ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 relative transition-colors ${
              activeTab === 'about'
                ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            About
          </button>
        </div>

        {/* 4. محتوى التبويبات */}
        <div className="mt-6">
          {activeTab === 'videos' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videosData?.pages.map((page) =>
                  page.items.map((video: any) => (
                    <VideoCard key={video.id.videoId || video.id} video={video} />
                  ))
                )}
              </div>

              {/* زر تحميل المزيد */}
              {hasNextPage && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-6 py-2.5 bg-slate-100 dark:bg-[#131f37] text-slate-800 dark:text-slate-200 rounded-full font-medium text-sm hover:bg-slate-200 dark:hover:bg-[#1c2d52] transition-colors disabled:opacity-50"
                  >
                    {isFetchingNextPage ? 'Loading...' : 'Load More Videos'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-3xl bg-slate-50 dark:bg-[#131f37] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">Description</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {snippet.description || 'No description available for this channel.'}
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <p>Joined: {new Date(snippet.publishedAt).toLocaleDateString()}</p>
                <p>Total Views: {formatViews(statistics?.viewCount || '0')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Channel;