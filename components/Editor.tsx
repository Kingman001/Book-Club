
import React, { useState } from 'react';
import { Sparkles, PlusCircle, X, Check } from 'lucide-react';
import { suggestTopics, improveWriting } from '../services/geminiService';

interface EditorProps {
  onPublish: (title: string, content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ onPublish }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isImproving, setIsImproving] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestTitles = async () => {
    if (!content) return;
    setIsSuggesting(true);
    const result = await suggestTopics(content);
    setSuggestions(result);
    setIsSuggesting(false);
  };

  const handleImproveContent = async () => {
    if (!content || content.length < 20) return;
    setIsImproving(true);
    const result = await improveWriting(content);
    setContent(result || content);
    setIsImproving(false);
  };

  const applySuggestion = (s: string) => {
    setTitle(s);
    setSuggestions([]);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-8 md:py-16">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
            <PlusCircle size={24} />
          </div>
          <span className="text-zinc-400 dark:text-zinc-500 text-sm italic">Draft in Julian Thorne</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleImproveContent}
            disabled={isImproving || content.length < 20}
            className="flex items-center gap-2 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors disabled:opacity-50"
            title="Refine your story with Gemini AI"
          >
            <Sparkles size={16} className={isImproving ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">AI Polish</span>
          </button>
          <button 
            onClick={() => onPublish(title, content)}
            disabled={!title || !content}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-md"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Title Input */}
        <div className="relative group">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-4xl md:text-5xl font-bold serif outline-none placeholder:text-zinc-200 dark:placeholder:text-zinc-800 bg-transparent text-zinc-900 dark:text-white resize-none h-fit"
            rows={1}
          />
          {content && (
             <button 
              onClick={handleSuggestTitles}
              className="absolute -left-12 top-2 p-2 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors opacity-0 group-hover:opacity-100 hidden md:block"
              title="Suggest titles with AI"
            >
              <Sparkles size={20} className={isSuggesting ? 'animate-spin' : ''} />
            </button>
          )}
        </div>

        {/* AI Title Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4 my-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">AI Suggestions</span>
              <button onClick={() => setSuggestions([])} className="text-indigo-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => applySuggestion(s)}
                  className="block w-full text-left p-2 hover:bg-white dark:hover:bg-zinc-900 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Input */}
        <div className="relative group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
            className="w-full text-xl serif outline-none placeholder:text-zinc-200 dark:placeholder:text-zinc-800 bg-transparent text-zinc-900 dark:text-zinc-100 resize-none min-h-[400px]"
          />
          {content.length > 20 && (
            <button 
              onClick={handleImproveContent}
              className="absolute -left-12 top-2 p-2 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors opacity-0 group-hover:opacity-100 hidden md:block"
              title="Improve writing with AI"
            >
              <Sparkles size={20} className={isImproving ? 'animate-pulse text-yellow-500 dark:text-yellow-400' : ''} />
            </button>
          )}
        </div>
      </div>

      {isImproving && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-indigo-600 dark:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce z-50">
          <Sparkles size={18} />
          Gemini is polishing your story...
        </div>
      )}
    </div>
  );
};

export default Editor;
