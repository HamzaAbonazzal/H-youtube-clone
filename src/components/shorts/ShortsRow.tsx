import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getShortsVideos } from '../../api/youtube';
import { Flame, X } from 'lucide-react';

interface ShortsRowProps {
  onDismiss?: () => void;
}

export const ShortsRow: React.FC<ShortsRowProps> = ({ onDismiss }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['shortsRowVideos'],
    queryFn: () => getShortsVideos(),
  });

  const shorts = data?.items || [];

  if (isLoading || shorts.length === 0) return null;

  return (
    <div className="my-8 pt-4 border-t border-b border-slate-200 dark:border-slate-800/80 pb-6 transition-colors">
      {/* عنوان الشريط الأيقوني */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          {/* أيقونة شورتس الحمراء */}
          <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center text-white font-bold text-xs">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Shorts
          </h2>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-[#131f37] text-slate-500 transition-colors"
            title="Not interested"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* شبكة فيديوهات Shorts العمودية (سلسلة أفقية مريحة) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {shorts.slice(0, 6).map((item: any) => {
          const videoId = typeof item.id === 'string' ? item.id : item.id.videoId;
          const snippet = item.snippet;

          return (
            <Link
              key={videoId}
              to="/shorts"
              className="flex flex-col gap-2 group cursor-pointer"
            >
              {/* بطاقة الفيديو بتنسيق 9:16 عمودي */}
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-200 dark:bg-[#131f37] border border-slate-200/50 dark:border-slate-800">
                <img
                  src={snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url}
                  alt={snippet.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              </div>

              {/* العنوان واسم القناة */}
              <div className="px-1">
                <h3 className="font-semibold text-sm line-clamp-2 leading-snug text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors">
                  {snippet.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {snippet.channelTitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};