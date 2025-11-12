import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: string[];
  quest: string;
  language: 'en' | 'ko';
  setLanguage: (lang: 'en' | 'ko') => void;
  storyModel: 'gemini-2.5-flash' | 'gemini-2.5-pro';
  setStoryModel: (model: 'gemini-2.5-flash' | 'gemini-2.5-pro') => void;
  imageModel: 'imagen-4.0-generate-001' | 'gemini-2.5-flash-image';
  setImageModel: (model: 'imagen-4.0-generate-001' | 'gemini-2.5-flash-image') => void;
  onNewGame: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  inventory,
  quest,
  language,
  setLanguage,
  storyModel,
  setStoryModel,
  imageModel,
  setImageModel,
  onNewGame,
}) => {
  const inventoryTitle = language === 'ko' ? '인벤토리' : 'Inventory';
  const questTitle = language === 'ko' ? '퀘스트' : 'Quest';
  const settingsTitle = language === 'ko' ? '설정' : 'Settings';
  const languageLabel = language === 'ko' ? '언어' : 'Language';
  const storyModelLabel = language === 'ko' ? '스토리 모델' : 'Story Model';
  const imageModelLabel = language === 'ko' ? '이미지 모델' : 'Image Model';
  const newGameButtonText = language === 'ko' ? '새 게임' : 'New Game';

  return (
    <aside
      className={`fixed top-0 right-0 h-full w-full max-w-sm bg-brand-surface shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-6 space-y-8 h-full overflow-y-auto">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-brand-primary">{settingsTitle}</h2>
            <button onClick={onClose} className="p-2 rounded-md hover:bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div>
            <h3 className="text-xl font-bold mb-4 border-b-2 border-brand-primary pb-2">{questTitle}</h3>
            <p className="text-brand-text-muted">{quest}</p>
        </div>

        <div>
            <h3 className="text-xl font-bold mb-4 border-b-2 border-brand-primary pb-2">{inventoryTitle}</h3>
            {inventory.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-brand-text-muted">
                {inventory.map((item, index) => (
                <li key={index}>{item}</li>
                ))}
            </ul>
            ) : (
            <p className="text-brand-text-muted italic">{language === 'ko' ? '인벤토리가 비어 있습니다.' : 'Your inventory is empty.'}</p>
            )}
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
            <div>
              <label htmlFor="language-select" className="block mb-2 text-sm font-medium text-brand-text">{languageLabel}</label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ko')}
                className="bg-brand-bg border border-brand-primary/50 text-brand-text text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5"
              >
                <option value="en">English</option>
                <option value="ko">한국어 (Korean)</option>
              </select>
            </div>
            <div>
              <label htmlFor="story-model-select" className="block mb-2 text-sm font-medium text-brand-text">{storyModelLabel}</label>
              <select
                id="story-model-select"
                value={storyModel}
                onChange={(e) => setStoryModel(e.target.value as 'gemini-2.5-flash' | 'gemini-2.5-pro')}
                className="bg-brand-bg border border-brand-primary/50 text-brand-text text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5"
              >
                <option value="gemini-2.5-flash">Fast (Flash)</option>
                <option value="gemini-2.5-pro">Deep (Pro)</option>
              </select>
            </div>
            <div>
              <label htmlFor="image-model-select" className="block mb-2 text-sm font-medium text-brand-text">{imageModelLabel}</label>
              <select
                id="image-model-select"
                value={imageModel}
                onChange={(e) => setImageModel(e.target.value as 'imagen-4.0-generate-001' | 'gemini-2.5-flash-image')}
                className="bg-brand-bg border border-brand-primary/50 text-brand-text text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5"
              >
                <option value="imagen-4.0-generate-001">Quality (Imagen 4)</option>
                <option value="gemini-2.5-flash-image">Fast (Flash Image)</option>
              </select>
            </div>
            <button
                onClick={onNewGame}
                className="w-full mt-4 p-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-purple-700 transition-colors duration-300"
            >
                {newGameButtonText}
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;