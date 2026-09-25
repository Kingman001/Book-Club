
import React from 'react';
import { Author, Article } from '../types';
import ArticleCard from './ArticleCard';

interface ProfileViewProps {
  user: Author;
  articles: Article[];
  onArticleClick: (id: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, articles, onArticleClick }) => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row gap-12">
      <div className="flex-1 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-8">{user.name}</h1>
        
        <div className="flex items-center gap-8 border-b border-zinc-100 dark:border-zinc-800 mb-8 overflow-x-auto no-scrollbar">
          <button className="pb-4 border-b border-zinc-900 dark:border-white text-sm font-medium text-zinc-900 dark:text-white">Home</button>
          <button className="pb-4 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">About</button>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {articles.length > 0 ? (
            articles.map(article => (
              <ArticleCard key={article.id} article={article} onClick={onArticleClick} />
            ))
          ) : (
            <div className="py-20 text-center text-zinc-500 dark:text-zinc-400">
              No stories published yet.
            </div>
          )}
        </div>
      </div>

      <aside className="w-full md:w-80 shrink-0 space-y-8">
        <div className="sticky top-24">
          <img src={user.avatar} className="w-20 h-20 rounded-full mb-4 object-cover ring-2 ring-zinc-50 dark:ring-zinc-900 shadow-lg" />
          <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-2">{user.name}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">{user.bio}</p>
          
          <div className="flex gap-4 text-sm text-zinc-900 dark:text-zinc-200 font-medium mb-8">
            <button className="hover:underline">{user.followers || 0} Followers</button>
            <button className="hover:underline">{user.following || 0} Following</button>
          </div>

          <button className="w-full bg-green-600 dark:bg-green-700 text-white py-2 rounded-full text-sm font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-md">
            Edit profile
          </button>
        </div>
      </aside>
    </div>
  );
};

export default ProfileView;