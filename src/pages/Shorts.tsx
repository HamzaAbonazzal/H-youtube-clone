import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getShortsVideos } from '../api/youtube';
import { ShortCard } from '../components/shorts/ShortCard';

export const Shorts: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['shortsVideos'],
    queryFn: () => getShortsVideos(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !data?.items) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)] text-slate-400">
        فشل في تحميل فيديوهات Shorts
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-70px)] overflow-y-scroll snap-y snap-mandatory py-4 flex flex-col gap-6 no-scrollbar">
      {data.items.map((video: any) => (
        <ShortCard 
          key={typeof video.id === 'string' ? video.id : video.id.videoId} 
          video={video} 
        />
      ))}
    </div>
  );
};

export default Shorts;