import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVideoComments } from '../../api/youtube';
import { X, ThumbsUp } from 'lucide-react';
import { formatViews } from '../../utils/formatters';

interface ShortsCommentsModalProps {
  videoId: string;
  onClose: () => void;
}

export const ShortsCommentsModal: React.FC<ShortsCommentsModalProps> = ({ videoId, onClose }) => {
  const { data: comments, isLoading, isError } = useQuery({
    queryKey: ['videoComments', videoId],
    queryFn: () => getVideoComments(videoId),
    enabled: !!videoId,
  });

  return (
    <div className="absolute inset-x-0 bottom-0 top-1/4 bg-slate-900/95 dark:bg-[#0b132b]/95 backdrop-blur-md rounded-t-2xl z-30 flex flex-col border-t border-slate-700/50 text-white animate-in slide-in-from-bottom duration-300">
      {/* رأس النافذة */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h3 className="font-bold text-base">Comments</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* قائمة التعليقات */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <p className="text-center text-xs text-slate-400 py-6">Failed to load comments</p>
        ) : comments && comments.length > 0 ? (
          comments.map((item: any) => {
            const comment = item.snippet.topLevelComment.snippet;
            return (
              <div key={item.id} className="flex items-start gap-3 text-xs">
                <img
                  src={comment.authorProfileImageUrl}
                  alt={comment.authorDisplayName}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-slate-200">
                      {comment.authorDisplayName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comment.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed break-words">
                    {comment.textDisplay}
                  </p>
                  <div className="flex items-center gap-1 text-slate-400 mt-1">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{formatViews(comment.likeCount)}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-xs text-slate-400 py-6">No comments found</p>
        )}
      </div>
    </div>
  );
};