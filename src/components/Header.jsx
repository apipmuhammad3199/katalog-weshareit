import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import useLanguageStore from '../store/useLanguageStore';

const Header = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { lang, setLang, t } = useLanguageStore();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/track/${searchQuery.trim()}`);
      setIsSearchExpanded(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-100/50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900 transition-opacity hover:opacity-70">
          Weshareit.
        </Link>

        {/* Right: Controls */}
        <div className="flex items-center gap-6">
          
          {/* Expanding Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className={`relative flex items-center transition-all duration-300 ease-out ${
              isSearchExpanded ? 'w-64 md:w-80' : 'w-10'
            }`}
          >
            <button 
              type="button"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center text-slate-900 hover:text-[#B35938] transition-colors"
            >
              <Search size={20} strokeWidth={2} />
            </button>
            <input 
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`h-10 w-full rounded-full bg-slate-100/80 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-gray-400 transition-all duration-300 ${
                isSearchExpanded ? 'opacity-100 cursor-text' : 'opacity-0 cursor-pointer pointer-events-none'
              } focus:bg-white focus:ring-1 focus:ring-[#B35938]`}
            />
          </form>

          {/* Language Toggle */}
          <div className="flex items-center text-sm font-semibold tracking-wide text-gray-500">
            <button 
              type="button"
              onClick={() => setLang('ID')}
              className={`transition-colors cursor-pointer ${lang === 'ID' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'}`}
            >
              ID
            </button>
            <span className="mx-2 opacity-30">/</span>
            <button 
              type="button"
              onClick={() => setLang('EN')}
              className={`transition-colors cursor-pointer ${lang === 'EN' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'}`}
            >
              EN
            </button>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
