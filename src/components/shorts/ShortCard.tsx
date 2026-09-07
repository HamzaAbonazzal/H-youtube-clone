import React, { useState, useEffect, useRef } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, Music2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { VideoItem } from '../../types/youtube';
import { ShortsCommentsModal } from './ShortsCommentsModal';

interface ShortCardProps {
  video: VideoItem;
}

export const ShortCard: React.FC<ShortCardProps> = ({ video }) => {
  const navigate = useNavigate();
  const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
  const snippet = video.snippet;

  const [isActive, setIsActive] = useState(false);
  const [isPausedManually, setIsPausedManually] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          setIsPausedManually(false);
        } else {
          setIsActive(false);
          setShowComments(false);
        }
      },
      { threshold: 0.6 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const shouldPlay = isActive && !isPausedManually;

  const togglePlay = () => {
    setIsPausedManually((prev) => !prev);
  };

  // الانتقال المباشر للقناة من الشورتس
  const handleChannelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/channel/${snippet.channelId}`);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-80px)] max-w-[420px] mx-auto snap-center shrink-0 rounded-2xl overflow-hidden bg-black shadow-2xl flex items-center justify-center border border-slate-800"
    >
      <div className="relative w-full h-full cursor-pointer" onClick={togglePlay}>
        {shouldPlay ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0`}
            title={snippet.title}
            className="w-full h-full object-cover pointer-events-none"
            allow="autoplay; encrypted-media"
          />
        ) : (
          <img
            src={snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url}
            alt={snippet.title}
            className="w-full h-full object-cover"
          />
        )}

        {isPausedManually && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
            <div className="p-4 bg-black/60 rounded-full text-white backdrop-blur-sm">
              <Play className="w-10 h-10 fill-current translate-x-0.5" />
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* صورة واسم القناة مع تحويل مباشر إلى القناة */}
      <div className="absolute bottom-4 left-4 right-16 z-10 text-white flex flex-col gap-2">
        <button 
          onClick={handleChannelClick}
          className="flex items-center gap-2 group w-fit text-left cursor-pointer"
        >
          {/* صورة القناة الدائرية */}
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm text-white overflow-hidden border border-white/20 group-hover:scale-105 transition-transform">
            {snippet.channelTitle ? snippet.channelTitle.charAt(0).toUpperCase() : 'C'}
          </div>
          {/* اسم القناة */}
          <span className="font-semibold text-sm group-hover:underline drop-shadow">
            @{snippet.channelTitle}
          </span>
        </button>

        <p className="text-sm line-clamp-2 leading-snug drop-shadow font-normal text-slate-100">
          {snippet.title}
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
          <Music2 className={`w-3.5 h-3.5 ${shouldPlay ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <span className="truncate">Original Audio - {snippet.channelTitle}</span>
        </div>
      </div>

      {/* الأزرار الجانبية */}
      <div className="absolute right-3 bottom-6 z-10 flex flex-col items-center gap-5 text-white">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`p-3 rounded-full backdrop-blur-md transition-transform active:scale-90 ${isLiked ? 'bg-red-600 text-white' : 'bg-black/40 hover:bg-black/60 text-white'}`}>
            <ThumbsUp className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-xs font-semibold drop-shadow">Like</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-transform active:scale-90">
            <ThumbsDown className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold drop-shadow">Dislike</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-transform active:scale-90">
            <MessageSquare className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold drop-shadow">Comments</span>
        </button>

        <button 
          onClick={() => navigator.clipboard.writeText(window.location.origin + '/watch/' + videoId)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-transform active:scale-90">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold drop-shadow">Share</span>
        </button>
      </div>

      {showComments && (
        <ShortsCommentsModal
          videoId={videoId}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
};