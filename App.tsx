
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import ArticleCard from './components/ArticleCard';
import ArticleView from './components/ArticleView';
import Editor from './components/Editor';
import ProfileView from './components/ProfileView';
import NotificationPanel from './components/NotificationPanel';
import { Article, ViewState, Author, Comment, Notification } from './types';
import { MOCK_ARTICLES, CATEGORIES } from './constants';
import { TrendingUp, Search as SearchIcon } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('For you');
  const [followedAuthorIds, setFollowedAuthorIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  // Interaction State
  const [clapsState, setClapsState] = useState<Record<string, number>>({});
  const [commentsState, setCommentsState] = useState<Record<string, Comment[]>>({});
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      type: 'follow',
      from: 'Elena Vance',
      fromAvatar: 'https://picsum.photos/seed/elena/100/100',
      read: false,
      createdAt: '2 hours ago'
    },
    {
      id: 'n2',
      type: 'clap',
      from: 'Sarah Chen',
      fromAvatar: 'https://picsum.photos/seed/sarah/100/100',
      articleTitle: 'Why Minimalist Design Still Rules',
      read: true,
      createdAt: 'Yesterday'
    }
  ]);

  const currentUser: Author = {
    id: 'user1',
    name: 'Julian Thorne',
    avatar: 'https://picsum.photos/seed/julian/100/100',
    bio: 'Product designer focusing on simplicity and mindful technology experiences.',
    followers: 128,
    following: followedAuthorIds.length
  };

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  const recommendedAuthors = useMemo(() => {
    const authorsMap = new Map<string, Author>();
    articles.forEach(article => {
      if (article.author.id !== currentUser.id) {
        authorsMap.set(article.author.id, article.author);
      }
    });
    return Array.from(authorsMap.values()).slice(0, 3);
  }, [articles, currentUser.id]);

  const handleNavigate = (newView: ViewState) => {
    setView(newView);
    if (newView === 'home') setSelectedArticleId(null);
    window.scrollTo(0, 0);
  };

  const handleOpenArticle = (id: string) => {
    setSelectedArticleId(id);
    setView('article');
    window.scrollTo(0, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setView('search');
    } else if (view === 'search') {
      setView('home');
    }
  };

  const toggleFollow = (authorId: string) => {
    setFollowedAuthorIds(prev => {
      const isFollowing = prev.includes(authorId);
      if (!isFollowing) {
        const author = articles.find(a => a.author.id === authorId)?.author;
        if (author) {
          addNotification({
            type: 'follow',
            from: author.name,
            fromAvatar: author.avatar,
            createdAt: 'Just now'
          });
        }
      }
      return isFollowing ? prev.filter(id => id !== authorId) : [...prev, authorId];
    });
  };

  const handleClap = (id: string) => {
    setClapsState(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleAddComment = (articleId: string, text: string, parentId?: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      text,
      createdAt: 'Just now',
      replies: []
    };

    setCommentsState(prev => {
      const currentComments = prev[articleId] || [];
      if (!parentId) return { ...prev, [articleId]: [newComment, ...currentComments] };

      const insertReply = (list: Comment[]): Comment[] => {
        return list.map(c => {
          if (c.id === parentId) return { ...c, replies: [newComment, ...(c.replies || [])] };
          if (c.replies && c.replies.length > 0) return { ...c, replies: insertReply(c.replies) };
          return c;
        });
      };
      return { ...prev, [articleId]: insertReply(currentComments) };
    });
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'read'>) => {
    setNotifications(prev => [
      { ...notif, id: Math.random().toString(36).substr(2, 9), read: false },
      ...prev
    ]);
  };

  const handleClearNotifications = () => setNotifications([]);
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handlePublish = (title: string, content: string) => {
    const newArticle: Article = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      subtitle: content.substring(0, 100).replace(/\n/g, ' ') + '...',
      content,
      author: currentUser,
      publishedAt: 'Just now',
      readTime: Math.ceil(content.split(' ').length / 200) + ' min read',
      category: 'Writing',
      imageUrl: `https://picsum.photos/seed/${Math.random()}/800/400`,
      tags: ['New']
    };
    setArticles([newArticle, ...articles]);
    setView('home');
    window.scrollTo(0, 0);
  };

  const displayedArticles = useMemo(() => {
    let filtered = articles;
    if (view === 'search' || searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return articles.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.subtitle.toLowerCase().includes(q) || 
        a.category.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (activeCategory === 'Following') {
      return articles.filter(article => followedAuthorIds.includes(article.author.id));
    }
    if (activeCategory === 'For you') return articles;
    return articles.filter(article => article.category === activeCategory);
  }, [articles, activeCategory, followedAuthorIds, searchQuery, view]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300`}>
      <Navbar 
        onNavigate={handleNavigate} 
        currentView={view} 
        unreadNotificationsCount={unreadCount}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />
      
      <main className="flex-1">
        {(view === 'home' || view === 'search') && (
          <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-12">
            <div className="flex-1 max-w-2xl">
              {view === 'search' ? (
                <div className="mb-12">
                  <h1 className="text-3xl font-bold dark:text-white mb-2">Results for "{searchQuery}"</h1>
                  <p className="text-zinc-500 dark:text-zinc-400">{displayedArticles.length} stories found</p>
                </div>
              ) : (
                <div className="flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-zinc-100 dark:border-zinc-800 mb-8 pb-4">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`whitespace-nowrap text-sm ${activeCategory === cat ? 'text-zinc-900 dark:text-white font-medium border-b border-zinc-900 dark:border-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'} pb-1 transition-all`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {displayedArticles.length > 0 ? (
                  displayedArticles.map(article => (
                    <ArticleCard key={article.id} article={article} onClick={handleOpenArticle} />
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <div className="bg-zinc-50 dark:bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <SearchIcon className="text-zinc-400" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                      {view === 'search' ? "No matches found." : "Nothing to see here."}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                      {view === 'search' ? "Check your spelling or try more general keywords." : "Follow authors or explore topics to fill your feed."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <aside className="hidden lg:block w-80 shrink-0 space-y-12 sticky top-24 h-fit">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-zinc-900 dark:text-white" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Trending on Medium</h3>
                </div>
                <div className="space-y-6">
                  {articles.slice(0, 3).map((a, i) => (
                    <div key={a.id} className="flex gap-4 group cursor-pointer" onClick={() => handleOpenArticle(a.id)}>
                      <span className="text-3xl font-bold text-zinc-100 dark:text-zinc-800 group-hover:text-zinc-200 dark:group-hover:text-zinc-700 transition-colors">0{i+1}</span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <img src={a.author.avatar} className="rounded-full w-4 h-4 object-cover" />
                          <span className="text-xs font-medium text-zinc-800 dark:text-zinc-300">{a.author.name}</span>
                        </div>
                        <h4 className="text-sm font-bold leading-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors line-clamp-2">{a.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Who to follow</h3>
                <div className="space-y-5">
                  {recommendedAuthors.map((author) => {
                    const isFollowing = followedAuthorIds.includes(author.id);
                    return (
                      <div key={author.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={author.avatar} className="rounded-full w-8 h-8 object-cover shadow-sm" alt={author.name} />
                          <div>
                            <div className="text-sm font-bold text-zinc-900 dark:text-white">{author.name}</div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-500 line-clamp-1 max-w-[120px]">{author.bio}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleFollow(author.id)}
                          className={`text-xs font-medium px-4 py-1.5 rounded-full transition-all border ${
                            isFollowing 
                              ? 'bg-transparent text-zinc-500 border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300' 
                              : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 hover:bg-zinc-700 dark:hover:bg-zinc-200'
                          }`}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button className="text-sm text-green-600 dark:text-green-500 font-medium mt-6 block hover:text-green-700 dark:hover:text-green-400 transition-colors">See more suggestions</button>
              </section>
            </aside>
          </div>
        )}

        {view === 'article' && selectedArticle && (
          <ArticleView 
            article={selectedArticle} 
            onBack={() => handleNavigate('home')} 
            isFollowing={followedAuthorIds.includes(selectedArticle.author.id)}
            onToggleFollow={toggleFollow}
            claps={clapsState[selectedArticle.id] || 0}
            onClap={() => handleClap(selectedArticle.id)}
            comments={commentsState[selectedArticle.id] || []}
            onAddComment={(text, parentId) => handleAddComment(selectedArticle.id, text, parentId)}
          />
        )}

        {view === 'profile' && (
          <ProfileView 
            user={currentUser} 
            articles={articles.filter(a => a.author.id === currentUser.id)} 
            onArticleClick={handleOpenArticle} 
          />
        )}

        {view === 'notifications' && (
          <NotificationPanel 
            notifications={notifications} 
            onClearAll={handleClearNotifications} 
            onRead={handleMarkNotificationRead} 
          />
        )}

        {view === 'write' && (
          <Editor onPublish={handlePublish} />
        )}
      </main>
    </div>
  );
};

export default App;