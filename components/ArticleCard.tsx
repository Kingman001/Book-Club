
import React from 'react';
import { Article } from '../types';
import { BookmarkPlus, MinusCircle, MoreHorizontal } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onClick: (id: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  return (
    <article 
      className="py-8 border-b border-zinc-100 dark:border-zinc-800 cursor-pointer group flex flex-col md:flex-row gap-6 transition-colors"
      onClick={() => onClick(article.id)}
    >
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <img src={article.author.avatar} alt={article.author.name} className="w-6 h-6 rounded-full object-cover" />
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{article.author.name}</span>
          <span className="text-sm text-zinc-400">·</span>
          <span className="text-sm text-zinc-400">{article.publishedAt}</span>
        </div>
        
        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white leading-tight group-hover:underline">
          {article.title}
        </h2>
        
        <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed hidden md:block">
          {article.subtitle}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-600 dark:text-zinc-400">
              {article.category}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-500">{article.readTime}</span>
          </div>
          
          <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-600">
            <BookmarkPlus size={20} className="hover:text-zinc-900 dark:hover:text-white transition-colors" />
            <MinusCircle size={20} className="hover:text-zinc-900 dark:hover:text-white transition-colors" />
            <MoreHorizontal size={20} className="hover:text-zinc-900 dark:hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      <div className="w-full md:w-48 h-32 md:h-40 shrink-0">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover rounded-sm grayscale-[0.2] dark:grayscale-[0.4] group-hover:grayscale-0 transition-all"
        />
      </div>
    </article>
  );
};

export default ArticleCard;