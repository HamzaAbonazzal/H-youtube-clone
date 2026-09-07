import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVideoDetails, getVideoComments, searchVideos } from '../api/youtube';
import { formatViews, formatTimeAgo } from '../utils/formatters';
import { useWatchHistory } from '../hooks/useWatchHistory';
import { ThumbsUp, Share2, Save, MessageSquareOff, ChevronDown, ChevronUp } from 'lucide-react';
import { VideoCard } from '../components/video/VideoCard';
import { useTranslation } from 'react-i18next';

export const Watch: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { addToHistory } = useWatchHistory();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // جلب تفاصيل الفيديو
  const { data: video, isLoading: isVideoLoading } = useQuery({
    queryKey: ['videoDetails', videoId],
    queryFn: () => getVideoDetails(videoId!),
    enabled: !!videoId,
  });

  // جلب تعليقات الفيديو
  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ['videoComments', videoId],
    queryFn: () => getVideoComments(videoId!),
    enabled: !!videoId,
  });

  // جلب الفيديوهات المقترحة بناءً على عنوان الفيديو أو الفئة
  const { data: relatedVideosData } = useQuery({
    queryKey: ['relatedVideos', videoId, video?.snippet?.title],
    queryFn: () => searchVideos(video?.snippet?.title || 'trending'),
    enabled: !!video?.snippet?.title,
  });

  const relatedVideos = relatedVideosData?.items || [];

  useEffect(() => {
    if (video) {
      addToHistory(video);
    }
  }, [video, addToHistory]);
  const { t } = useTranslation();

  if (!videoId) return <div className="p-4 text-center text-red-500 font-medium">Invalid Video ID</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-2 sm:p-4 lg:p-6 max-w-[1800px] mx-auto min-h-screen">
      {/* العمود الرئيسي الأيسر: مشغل الفيديو + التفاصيل + التعليقات */}
      <div className="flex-1 w-full lg:max-w-[calc(100%-400px)] xl:max-w-[calc(100%-440px)]">
        
        {/* YouTube Embed Player */}
        <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-lg">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&enablejsapi=1`}
            title="YouTube video player"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Video Metadata Skeleton Loading */}
        {isVideoLoading && (
          <div className="mt-4 space-y-3 animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
          </div>
        )}

        {/* Video Metadata */}
        {video && (
          <div className="mt-3 sm:mt-4">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {video.snippet.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
              {/* Channel Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 uppercase shrink-0">
                  {video.snippet.channelTitle.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 line-clamp-1">
                    {video.snippet.channelTitle}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatViews(video.statistics?.viewCount || '0')} • {formatTimeAgo(video.snippet.publishedAt)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button className="flex items-center gap-2 bg-slate-100 dark:bg-[#131f37] text-slate-800 dark:text-slate-200 px-3.5 py-2 rounded-full font-medium text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-[#1c2d52] transition-colors shrink-0">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{formatViews(video.statistics?.likeCount || '0')}</span>
                </button>
                <button className="flex items-center gap-2 bg-slate-100 dark:bg-[#131f37] text-slate-800 dark:text-slate-200 px-3.5 py-2 rounded-full font-medium text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-[#1c2d52] transition-colors shrink-0">
                  <Share2 className="w-4 h-4" />
                  <span>{t("share")}</span>
                </button>
                <button className="flex items-center gap-2 bg-slate-100 dark:bg-[#131f37] text-slate-800 dark:text-slate-200 px-3.5 py-2 rounded-full font-medium text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-[#1c2d52] transition-colors shrink-0">
                  <Save className="w-4 h-4" />
                  <span>{t("save")}</span>
                </button>
              </div>
            </div>

            {/* Description Box */}
            <div className="mt-4 p-3.5 sm:p-4 bg-slate-100 dark:bg-[#131f37] text-slate-800 dark:text-slate-200 rounded-xl text-xs sm:text-sm leading-relaxed transition-all relative">
              <div className={isDescriptionExpanded ? '' : 'line-clamp-3'}>
                <p className="whitespace-pre-line">{video.snippet.description}</p>
              </div>
              
              {video.snippet.description && video.snippet.description.length > 150 && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {isDescriptionExpanded ? (
                    <>{t("show_less")} <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>{t("show_more")} <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-6 sm:mt-8 bg-slate-50 dark:bg-[#131f37] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800/80 transition-colors">
          <h2 className="text-base sm:text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">
            {t("comments")} ({comments?.length || 0})
          </h2>

          {isCommentsLoading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
              {comments.map((comment) => {
                const topComment = comment.snippet.topLevelComment.snippet;
                return (
                  <div key={comment.id} className="flex gap-3 text-left">
                    <img
                      src={topComment.authorProfileImageUrl}
                      alt={topComment.authorDisplayName}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-900 dark:text-slate-200 truncate max-w-[150px] sm:max-w-none">
                          {topComment.authorDisplayName}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {formatTimeAgo(topComment.publishedAt)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm mt-1 text-slate-700 dark:text-slate-300 leading-normal">
                        {topComment.textDisplay}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500 dark:text-slate-400 gap-2">
              <MessageSquareOff className="w-8 h-8 opacity-50" />
              <p className="text-xs sm:text-sm font-medium">{t("no_comments")}</p>
            </div>
          )}
        </div>
      </div>

      {/* العمود الأيمن: الفيديوهات المقترحة */}
      <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 flex flex-col gap-4 mt-4 lg:mt-0">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
          {t("suggested_videos")}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {relatedVideos.map((item) => (
            <VideoCard
              key={typeof item.id === 'string' ? item.id : item.id.videoId}
              video={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
};