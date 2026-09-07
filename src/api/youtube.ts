import axios from 'axios';
import type { VideoItem, CommentItemType } from '../types/youtube';
import i18n from '../i18n'; // استدعاء ملف إعدادات الترجمة معرفة اللغة الحالية

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const youtubeClient = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

// اعتراض الطلبات لإضافة معلمات اللغة (hl) والمنطقة (gl) تلقائياً مع كل طلب API
youtubeClient.interceptors.request.use((config) => {
  const currentLang = i18n.language || 'en';
  
  config.params = {
    ...config.params,
    hl: currentLang, // تحويل اللغة (ar أو en)
    gl: currentLang === 'ar' ? 'SA' : 'US', // تحديد المنطقة التابعة للغة
  };

  return config;
});

export interface FetchVideosResponse {
  items: VideoItem[];
  nextPageToken?: string;
}

export const fetchTrendingVideos = async (pageToken?: string): Promise<FetchVideosResponse> => {
  const response = await youtubeClient.get('/videos', {
    params: {
      part: 'snippet,contentDetails,statistics',
      chart: 'mostPopular',
      maxResults: 20, // جلب 20 فيديو في كل دفعة
      pageToken: pageToken || '',
    },
  });

  return {
    items: response.data.items,
    nextPageToken: response.data.nextPageToken,
  };
};

export interface SearchVideosResponse {
  items: VideoItem[];
  nextPageToken?: string;
}

export const searchVideos = async (query: string, pageToken?: string): Promise<SearchVideosResponse> => {
  const response = await youtubeClient.get('/search', {
    params: {
      part: 'snippet',
      q: query,
      maxResults: 20,
      type: 'video',
      pageToken: pageToken || '',
      regionCode: 'EG', // أو EG / AE لترجيح المحتوى العربي في المنطقة
      relevanceLanguage: 'ar', // إعطاء أولوية للنتائج العربية دون حجب الأجنبية
    },
  });

  return {
    items: response.data.items,
    nextPageToken: response.data.nextPageToken,
  };
};

export const getVideoDetails = async (videoId: string): Promise<VideoItem> => {
  const response = await youtubeClient.get('/videos', {
    params: {
      part: 'snippet,contentDetails,statistics',
      id: videoId,
    },
  });
  return response.data.items[0];
};

export const getVideoComments = async (videoId: string): Promise<CommentItemType[]> => {
  const response = await youtubeClient.get('/commentThreads', {
    params: {
      part: 'snippet',
      videoId: videoId,
      maxResults: 100,
    },
  });
  return response.data.items;
};

// جلب تفاصيل القناة (اسم، غلاف، إحصائيات)
export const getChannelDetails = async (channelId: string) => {
  const response = await youtubeClient.get('/channels', {
    params: {
      part: 'snippet,contentDetails,statistics,brandingSettings',
      id: channelId,
    },
  });
  return response.data.items[0];
};

// جلب فيديوهات القناة
export const getChannelVideos = async (channelId: string, pageToken?: string) => {
  const response = await youtubeClient.get('/search', {
    params: {
      part: 'snippet',
      channelId: channelId,
      order: 'date',
      maxResults: 12,
      pageToken: pageToken || '',
      type: 'video',
    },
  });
  return response.data;
};

// جلب فيديوهات Shorts
export const getShortsVideos = async (pageToken?: string) => {
  const response = await youtubeClient.get('/search', {
    params: {
      part: 'snippet',
      q: 'shorts #shorts',
      type: 'video',
      videoDuration: 'short', // يضمن جلب فيديوهات قصيرة
      maxResults: 10,
      pageToken: pageToken || '',
      regionCode: 'EG', // توجيه المنطقة للعالم العربي
      relevanceLanguage: 'ar', // إعطاء الأولوية القصوى للغة العربية
    },
  });
  return response.data;
};