import React from 'react';
import { useTranslation } from 'react-i18next';


// const categories = [
//   t("all"), t("shorts"), t("gaming"), t("music"), t("live"),
//   t("programming"), t("podcasts"), t("news"), t("sports"), t("technology"),
// ];

const categories = [
  { id: 'all', key: 'category_all' },
  { id: 'shorts', key: 'category_shorts' },
  { id: 'gaming', key: 'category_gaming' },
  { id: 'music', key: 'category_music' },
  { id: 'live', key: 'category_live' },
  { id: 'programming', key: 'category_programming' },
  { id: 'podcasts', key: 'category_podcasts' },
  { id: 'news', key: 'category_news' },
  { id: 'sports', key: 'category_sports' },
  { id: 'technology', key: 'category_technology' },
];

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useTranslation()
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 pt-2 scrollbar-none px-4 bg-white dark:bg-dark-blue sticky top-14 z-40 border-b border-slate-200 dark:border-neutral-800 transition-colors">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === cat.id
              ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
              : 'bg-slate-100 dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 hover:bg-slate-200 dark:hover:bg-neutral-700'
          }`}
        >
          {t(cat.id)}
        </button>
      ))}
    </div>
  );
};