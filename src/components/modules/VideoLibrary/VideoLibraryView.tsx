import React, { useState } from 'react';
import type { VideoItem } from '../../../types';
import { mockVideos } from '../../../data/mockData';
import { Bookmark, Eye, Clock } from 'lucide-react';

export const VideoLibraryView: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>(mockVideos);
  const [activeVideo, setActiveVideo] = useState<VideoItem>(mockVideos[0]);

  const toggleBookmark = (id: string) => {
    setVideos(videos.map(v => v.id === id ? { ...v, isBookmarked: !v.isBookmarked } : v));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">On-Demand Video Library</h1>
        <p className="text-xs text-gray-500">Stream high-definition lecture recordings with interactive speed controls and bookmarks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-card relative group">
            <video
              id="lms-video-player"
              src={activeVideo.videoUrl}
              poster={activeVideo.thumbnail}
              controls
              className="w-full aspect-video object-cover"
            />
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                {activeVideo.courseName}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{activeVideo.title}</h2>
              <div className="text-xs text-gray-500 flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Duration: {activeVideo.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {activeVideo.views} views
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark(activeVideo.id)}
                className={`p-2 rounded-xl border text-xs font-semibold transition-200 ${
                  activeVideo.isBookmarked
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${activeVideo.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Course Video Playlist</h3>
          <div className="space-y-3">
            {videos.map((vid) => {
              const isActive = activeVideo.id === vid.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => setActiveVideo(vid)}
                  className={`p-3 rounded-xl border transition-200 cursor-pointer flex gap-3 ${
                    isActive ? 'border-blue-600 bg-blue-50/40 shadow-xs' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={vid.thumbnail} alt={vid.title} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{vid.title}</h4>
                    <div className="text-[10px] text-gray-500 mt-1 flex items-center justify-between">
                      <span>{vid.duration}</span>
                      <span className="font-semibold text-blue-600">{vid.progressPercent}% watched</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
