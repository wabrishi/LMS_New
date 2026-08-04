import React, { useState } from 'react';
import type { ChatMessage } from '../../../types';
import { mockMessages, mockFaculty } from '../../../data/mockData';
import { Send, Paperclip, CheckCheck, Search } from 'lucide-react';

export const MessagingModuleView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [activeContact, setActiveContact] = useState(mockFaculty[0]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'std-1',
      senderName: 'Aarav Sharma',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      receiverId: activeContact.id,
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInputMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Direct Messages & Communication Hub</h1>
        <p className="text-xs text-gray-500">Realtime direct messaging between Students, Faculty Trainers, and Institute Administrators.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-card h-[600px] flex overflow-hidden">
        {/* Contact List Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search faculty or student..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {mockFaculty.map((fac) => {
              const isActive = activeContact.id === fac.id;
              return (
                <button
                  key={fac.id}
                  onClick={() => setActiveContact(fac)}
                  className={`w-full p-3 flex items-center gap-3 text-left transition-200 ${
                    isActive ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <img src={fac.avatarUrl} alt={fac.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-xs truncate">{fac.name}</div>
                    <div className="text-[10px] text-blue-600 font-semibold">{fac.designation}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 flex flex-col justify-between bg-white">
          {/* Thread Header */}
          <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white">
            <img src={activeContact.avatarUrl} alt={activeContact.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{activeContact.name}</h3>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                ● Online
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="p-4 space-y-3 flex-1 overflow-y-auto bg-gray-50/30">
            {messages.map((msg) => {
              const isMe = msg.senderId === 'std-1';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-md p-3 rounded-2xl text-xs space-y-1 ${
                      isMe ? 'bg-blue-600 text-white rounded-br-none shadow-xs' : 'bg-white border border-gray-200 text-slate-900 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <div className={`text-[9px] flex items-center justify-end gap-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
            <button type="button" className="p-2 text-gray-400 hover:text-slate-900 rounded-xl hover:bg-gray-100">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md shadow-blue-500/20"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
