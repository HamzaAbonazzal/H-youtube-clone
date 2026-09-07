import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Sun, Moon, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { LanguageSwitcher } from '../switchlang/SwitchLang';
import { useTranslation } from 'react-i18next';

export const Navbar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const isRtl = i18n.language === 'ar';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-2 sm:px-4 h-14 bg-white dark:bg-dark-blue border-b border-slate-200 dark:border-neutral-800 transition-colors">
      
      {/* 1. حقل البحث الخاص بالهواتف المحمولة (يظهر فقط عند التفعيل على الشاشات الصغيرة) */}
      {isMobileSearchOpen ? (
        <div className="flex items-center w-full gap-2" >
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200"
          >
            {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          
          <form onSubmit={handleSearch} className="flex flex-1 items-center">
            <input
              type="text"
              autoFocus
              placeholder={t('search_placeholder')}
              dir="ltr"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-1.5 border border-slate-300 dark:border-neutral-700 rounded-s-full bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-sm placeholder-slate-400 dark:placeholder-neutral-500"
            />
            <button
              type="submit"
              className="px-4 py-2 border border-s-0 border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-800 rounded-e-full hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-200 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* 2. الشعار والاسم (Logo) */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link to="/" className="flex items-center gap-1.5">
              <svg className="w-7 h-5 sm:w-8 sm:h-6 fill-red-600 shrink-0" viewBox="0 0 28 20">
                <path d="M27.972 3.123a3.53 3.53 0 0 0-2.484-2.49C23.3 0 14 0 14 0S4.7 0 2.512.633A3.53 3.53 0 0 0 .028 3.123C0 5.312 0 10 0 10s0 4.688.028 6.877a3.53 3.53 0 0 0 2.484 2.491C4.7 20 14 20 14 20s9.3 0 11.488-.632a3.53 3.53 0 0 0 2.484-2.492C28 14.688 28 10 28 10s0-4.688-.028-6.877z" />
                <path fill="#fff" d="M11.2 14.3V5.7l7.4 4.3-7.4 4.3z" />
              </svg>
              <span className="xs:inline-block sm:inline text-base sm:text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
                H YouTube
              </span>
            </Link>
          </div>

          {/* 3. شريط البحث الأساسي (للأجهزة المتوسطة والكبيرة sm/md/lg) */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center flex-1 max-w-xs md:max-w-md lg:max-w-xl mx-2 sm:mx-4">
            <div className="flex w-full items-center">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                dir="ltr"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-neutral-700 rounded-s-full bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-xs sm:text-sm placeholder-slate-400 dark:placeholder-neutral-500"
              />
              <button
                type="submit"
                className="px-4 sm:px-6 py-2.5 border border-s-0 border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-800 rounded-e-full hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-200 transition-colors shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* 4. الأزرار الجانبية (البحث للشاشات الصغيرة + الثيم + تبديل اللغة) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* زر تشغيل البحث الهاتفي */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(true)}
              className="sm:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* زر الثيم (مظلم / مضيء) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* مكون تبديل اللغة */}
            <LanguageSwitcher />
          </div>
        </>
      )}
    </nav>
  );
};