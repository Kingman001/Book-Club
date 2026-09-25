
import React, { useState, useEffect } from 'react';
import { Article, Comment } from '../types';
import { ArrowLeft, Sparkles, MessageCircle, Heart, Share2, Bookmark, Send, Reply, X } from 'lucide-react';
import { getArticleSummary } from '../services/geminiService';

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string, text: string) => void;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText('');
    setIsReplying(false);
  };

  return (
    <div className={`group ${depth > 0 ? 'ml-6 md:ml-10 border-l border-zinc-100 dark:border-zinc-800 pl-4 md:pl-6 mt-6' : 'border-b border-zinc-50 dark:border-zinc-900 pb-8 last:border-0 mb-8'}`}>
      <div className="flex items-center gap-3 mb-3">
        <img src={comment.authorAvatar} className="w-8 h-8 rounded-full object-cover" alt={comment.authorName} />
        <div>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{comment.authorName}</div>
          <div className="text-xs text-zinc-400 dark:text-zinc-500">{comment.createdAt}</div>
        </div>
      </div>
      
      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm mb-3">
        {comment.text}
      </p>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsReplying(!isReplying)}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          {isReplying ? <X size={14} /> : <Reply size={14} />}
          {isReplying ? 'Cancel' : 'Reply'}
        </button>
      </div>

      {isReplying && (
        <form onSubmit={handleSubmit} className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <textarea
            autoFocus
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${comment.authorName}...`}
            className="w-full text-sm p-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg outline-none focus:border-zinc-400 dark:focus:border-zinc-600 text-zinc-900 dark:text-white transition-colors resize-none min-h-[80px]"
          />
          <div className="flex justify-end mt-2">
            <button 
              type="submit"
              disabled={!replyText.trim()}
              className="bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              Post Reply
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              onReply={onReply} 
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  isFollowing: boolean;
  onToggleFollow: (authorId: string) => void;
  claps: number;
  onClap: () => void;
  comments: Comment[];
  onAddComment: (text: string, parentId?: string) => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ 
  article, onBack, isFollowing, onToggleFollow, claps, onClap, comments, onAddComment 
}) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    const result = await getArticleSummary(article.content);
    setSummary(result || "Error generating summary.");
    setLoadingSummary(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8 md:py-16">
      <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
        <div 
          className="h-full bg-green-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to feed
      </button>

      <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white leading-tight serif mb-4">
        {article.title}
      </h1>
      
      <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
        {article.subtitle}
      </p>

      <div className="flex items-center justify-between py-6 border-y border-zinc-100 dark:border-zinc-800 mb-10">
        <div className="flex items-center gap-4">
          <img src={article.author.avatar} alt={article.author.name} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{article.author.name}</span>
              <button 
                onClick={() => onToggleFollow(article.author.id)}
                className={`text-sm font-medium transition-colors ${isFollowing ? 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200' : 'text-green-600 hover:text-green-700'}`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-500">
              {article.readTime} · {article.publishedAt}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-zinc-500 dark:text-zinc-400">
          <Share2 size={20} className="cursor-pointer hover:text-zinc-900 dark:hover:text-white" />
          <Bookmark size={20} className="cursor-pointer hover:text-zinc-900 dark:hover:text-white" />
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 mb-12 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
            <Sparkles size={18} />
            <span>AI Key Takeaways</span>
          </div>
          {!summary && !loadingSummary && (
            <button 
              onClick={handleGenerateSummary}
              className="text-xs bg-indigo-600 dark:bg-indigo-500 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors font-medium shadow-sm"
            >
              Generate Summary
            </button>
          )}
        </div>
        {loadingSummary ? (
          <div className="flex gap-2 items-center text-zinc-500 dark:text-zinc-400 text-sm italic animate-pulse">
            <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
            Analyzing content with Gemini...
          </div>
        ) : summary ? (
          <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm prose dark:prose-invert max-w-none">
            {summary.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
          </div>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">Get a quick digest of this story powered by AI.</p>
        )}
      </div>

      <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none serif leading-relaxed text-zinc-800 dark:text-zinc-200 space-y-6 text-xl mb-16">
        {article.content.split('\n').map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      <div className="sticky bottom-4 mx-auto w-fit bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 px-6 py-3 rounded-full shadow-2xl flex items-center gap-8 text-zinc-500 dark:text-zinc-400 z-40 transition-colors">
        <button 
          onClick={onClap}
          className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors group"
        >
          <Heart size={22} className={`${claps > 0 ? 'fill-red-500 text-red-500' : 'group-hover:text-red-500 dark:group-hover:text-red-400'}`} />
          <span className="text-sm font-medium">{claps > 0 ? claps : 'Clap'}</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <MessageCircle size={22} />
          <span className="text-sm font-medium">{comments.length}</span>
        </button>
        <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800" />
        <Bookmark size={22} className="cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors" />
        <Share2 size={22} className="cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors" />
      </div>

      {showComments && (
        <div className="mt-12 pt-12 border-t border-zinc-100 dark:border-zinc-800">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">Responses ({comments.length})</h3>
          
          <form onSubmit={handleCommentSubmit} className="mb-10 p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 text-xs font-bold">JT</div>
              <span className="text-sm font-medium dark:text-zinc-200">Julian Thorne</span>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full text-sm outline-none resize-none min-h-[100px] text-zinc-800 dark:text-zinc-200 bg-transparent"
            />
            <div className="flex justify-end mt-2">
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
              >
                Respond
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                onReply={(parentId, text) => onAddComment(text, parentId)} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleView;