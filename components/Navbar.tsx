
import React from 'react';
import { Search, SquarePen, Bell, UserCircle2, Sun, Moon, X } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
  unreadNotificationsCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, 
  currentView, 
  unreadNotificationsCount, 
  isDarkMode, 
  onToggleTheme,
  searchQuery,
  onSearchChange
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 px-4 py-2 md:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => {
            onSearchChange('');
            onNavigate('home');
          }}
          className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-serif"
        >
          Medium
        </button>
        <div className="hidden md:flex items-center bg-zinc-50 dark:bg-zinc-900 rounded-full px-4 py-2 text-zinc-500 dark:text-zinc-400 group focus-within:ring-1 focus-within:ring-zinc-300 dark:focus-within:ring-zinc-700 transition-all w-64">
          <Search size={18} className="mr-2 group-focus-within:text-zinc-900 dark:group-focus-within:text-white" />
          <input 
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-zinc-900 dark:text-white"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="ml-1 hover:text-zinc-900 dark:hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={onToggleTheme}
          className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button 
          onClick={() => onNavigate('write')}
          className={`flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors ${currentView === 'write' ? 'text-zinc-900 dark:text-white' : ''}`}
        >
          <SquarePen size={22} />
          <span className="hidden md:inline text-sm font-medium">Write</span>
        </button>
        
        <button 
          onClick={() => onNavigate('notifications')}
          className={`text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors relative ${currentView === 'notifications' ? 'text-zinc-900 dark:text-white' : ''}`}
        >
          <Bell size={22} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white border-2 border-white dark:border-zinc-950">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => onNavigate('profile')}
          className={`flex items-center gap-2 cursor-pointer group ${currentView === 'profile' ? 'text-zinc-900 dark:text-white' : ''}`}
        >
          <UserCircle2 size={30} className="text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;