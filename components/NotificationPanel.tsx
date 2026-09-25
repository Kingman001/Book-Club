
import React from 'react';
import { Notification } from '../types';
import { Heart, MessageCircle, UserPlus, Trash2 } from 'lucide-react';

interface NotificationPanelProps {
  notifications: Notification[];
  onClearAll: () => void;
  onRead: (id: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClearAll, onRead }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'clap': return <Heart size={16} className="text-red-500 fill-red-500" />;
      case 'comment': return <MessageCircle size={16} className="text-blue-500" />;
      case 'follow': return <UserPlus size={16} className="text-green-600 dark:text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Notifications</h1>
        {notifications.length > 0 && (
          <button 
            onClick={onClearAll}
            className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => onRead(notif.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${notif.read ? 'bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 opacity-60' : 'bg-green-50/30 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 shadow-sm'}`}
            >
              <div className="flex gap-4">
                <div className="relative">
                  <img src={notif.fromAvatar} className="w-10 h-10 rounded-full object-cover" />
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-1 shadow-sm border border-zinc-50 dark:border-zinc-800">
                    {getIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
                    <span className="font-bold">{notif.from}</span>
                    {notif.type === 'clap' && ` clapped for your story "${notif.articleTitle}"`}
                    {notif.type === 'comment' && ` replied to your story "${notif.articleTitle}"`}
                    {notif.type === 'follow' && ` started following you`}
                  </div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{notif.createdAt}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-zinc-500 dark:text-zinc-400 italic">
            You're all caught up!
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;