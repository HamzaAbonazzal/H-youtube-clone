import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { VideoItem } from '../../types/youtube';
import { formatViews } from '../../utils/formatters';

interface VideoCardProps {
  video: VideoItem;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const navigate = useNavigate();
  const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
  const snippet = video.snippet;

  // الانقال إلى صفحة القناة عند الضغط على اسمها أو صورتها
  const handleChannelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/channel/${snippet.channelId}`);
  };

  return (
    <div className="flex flex-col gap-2 group cursor-pointer">
      <Link to={`/watch/${videoId}`} className="block">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-[#131f37]">
          <img
            src={snippet.thumbnails.medium?.url || snippet.thumbnails.high?.url}
            alt={snippet.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="flex gap-3 items-start px-1">
        {/* صورة القناة - عند النقر عليها تفتح صفحة القناة */}
        <button
          onClick={handleChannelClick}
          className="w-9 h-9 rounded-full bg-slate-700 shrink-0 flex items-center justify-center font-bold text-white text-sm overflow-hidden hover:opacity-80 transition-opacity border border-slate-600/30"
        >
          {snippet.channelTitle ? snippet.channelTitle.charAt(0).toUpperCase() : 'C'}
        </button>

        <div className="flex flex-col flex-1 min-w-0">
          <Link to={`/watch/${videoId}`}>
            <h3 className="font-semibold text-sm line-clamp-2 leading-snug text-slate-900 dark:text-slate-100 group-hover:text-blue-500 transition-colors">
              {snippet.title}
            </h3>
          </Link>

          {/* اسم القناة - عند النقر عليه يفتح صفحة القناة */}
          <button
            onClick={handleChannelClick}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mt-1 w-fit truncate text-left"
          >
            {snippet.channelTitle}
          </button>

          <span className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">
            {new Date(snippet.publishedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};