import React from 'react';

interface SidebarProps {
  inventory: string[];
  quest: string;
  language: 'en' | 'ko';
}

const Sidebar: React.FC<SidebarProps> = ({ inventory, quest, language }) => {
  const t = {
    en: {
      quest: 'Quest',
      inventory: 'Inventory',
      emptyInventory: 'Your inventory is empty.'
    },
    ko: {
      quest: '퀘스트',
      inventory: '인벤토리',
      emptyInventory: '인벤토리가 비어있습니다.'
    }
  }

  return (
    <aside className="w-full md:w-64 lg:w-80 bg-brand-surface p-6 flex-shrink-0 md:h-screen md:sticky md:top-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-brand-primary border-b-2 border-brand-primary pb-2">{t[language].quest}</h2>
        <p className="text-brand-text-light">{quest}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-brand-primary border-b-2 border-brand-primary pb-2">{t[language].inventory}</h2>
        {inventory.length > 0 ? (
          <ul className="space-y-2">
            {inventory.map((item, index) => (
              <li key={index} className="bg-brand-bg p-3 rounded-md shadow">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-brand-text-light">{t[language].emptyInventory}</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;