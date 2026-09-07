import { useState, useEffect } from 'react';
import type { VideoItem } from '../types/youtube';

export const useWatchHistory = () => {
  const [history, setHistory] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('watchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (video: VideoItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => {
        const id = typeof item.id === 'string' ? item.id : item.id.videoId;
        const newId = typeof video.id === 'string' ? video.id : video.id.videoId;
        return id !== newId;
      });
      return [video, ...filtered];
    });
  };

  const clearHistory = () => setHistory([]);

  return { history, addToHistory, clearHistory };
};