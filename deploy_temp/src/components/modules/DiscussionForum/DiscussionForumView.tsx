import React, { useState } from 'react';
import type { ForumPost } from '../../../types';
import { mockForumPosts } from '../../../data/mockData';
import { ThumbsUp, Pin, MessageCircle, Plus } from 'lucide-react';
import { Modal } from '../../common/Modal';

export const DiscussionForumView: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(mockForumPosts);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ForumPost = {
      id: `post-${Date.now()}`,
      authorName: 'Aarav Sharma',
      authorRole: 'STUDENT',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: title,
      content: content,
      tags: ['Discussion', 'Questions'],
      upvotes: 1,
      replyCount: 0,
      isPinned: false,
      createdAt: 'Just now',
      replies: []
    };
    setPosts([created, ...posts]);
    setIsNewPostOpen(false);
    setTitle('');
    setContent('');
  };

  const handleUpvote = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Academic Discussion Forum</h1>
          <p className="text-xs text-gray-500">Collaborative Q&A community for students, trainers, and peer discussions.</p>
        </div>
        <button
          onClick={() => setIsNewPostOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-200"
        >
          <Plus className="w-4 h-4" /> Ask Question / Start Thread
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-card hover:shadow-md transition-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{post.authorName}</span>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {post.authorRole}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">{post.createdAt}</span>
                </div>
              </div>

              {post.isPinned && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Pin className="w-3 h-3 text-amber-600" /> Pinned Thread
                </span>
              )}
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm">{post.title}</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{post.content}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUpvote(post.id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-semibold transition-200"
                >
                  <ThumbsUp className="w-4 h-4" /> {post.upvotes} Upvotes
                </button>
                <span className="flex items-center gap-1 text-gray-400">
                  <MessageCircle className="w-4 h-4" /> {post.replies.length} Replies
                </span>
              </div>

              <div className="flex gap-1">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {post.replies.length > 0 && (
              <div className="mt-3 pl-4 border-l-2 border-blue-600 space-y-2 bg-gray-50 p-3 rounded-r-xl">
                {post.replies.map((rep) => (
                  <div key={rep.id} className="text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span>{rep.authorName}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{rep.createdAt}</span>
                    </div>
                    <p className="text-gray-600">{rep.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        title="Post New Thread in Forum"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Thread Subject *</label>
            <input
              type="text"
              required
              placeholder="e.g. Question about NestJS JWT authentication flow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description *</label>
            <textarea
              rows={4}
              required
              placeholder="Explain your question or suggestion in detail..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewPostOpen(false)}
              className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Post Question
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
