import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import StoryView from './components/StoryView';
import { GameState, StoryTurn } from './types';
import { getNextStoryPart, generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    story: '',
    image: '',
    choices: [],
    inventory: [],
    quest: '',
  });
  const [history, setHistory] = useState<StoryTurn[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ko'>('en');

  const t = {
    en: {
      title: 'Gemini Adventure',
      language: 'Language',
    },
    ko: {
      title: '제미니 어드벤처',
      language: '언어',
    }
  };

  const startGame = useCallback(async (lang: 'en' | 'ko') => {
    setLoading(true);
    setHistory([]);
    // Clear previous game state for a clean start
    setGameState({
        story: '',
        image: '',
        choices: [],
        inventory: [],
        quest: '',
    });
    const initialChoice = lang === 'ko' ? '모험을 시작합니다.' : 'Start the adventure.';

    try {
      const initialResponse = await getNextStoryPart([], initialChoice, lang);
      const initialImage = await generateImage(initialResponse.imagePrompt);

      setGameState({
        story: initialResponse.story,
        choices: initialResponse.choices,
        inventory: initialResponse.inventory,
        quest: initialResponse.quest,
        image: initialImage,
      });

      const modelTurn: StoryTurn = {
        role: 'model',
        parts: [{ text: JSON.stringify(initialResponse) }],
      };
      setHistory([
        { role: 'user', parts: [{ text: initialChoice }] },
        modelTurn,
      ]);

    } catch (error) {
      console.error("Failed to start the game:", error);
      const errorStory = language === 'ko' ? "게임 시작 중 오류가 발생했습니다. 페이지를 새로고침 해주세요." : "Error starting game. Please refresh the page.";
      setGameState(prev => ({...prev, story: errorStory, choices: []}));
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    startGame(language);
  }, [startGame, language]);


  const handleChoice = async (choice: string) => {
    setLoading(true);

    const userTurn: StoryTurn = { role: 'user', parts: [{ text: choice }] };
    const newHistory = [...history, userTurn];

    try {
      const response = await getNextStoryPart(history, choice, language);
      const newImage = await generateImage(response.imagePrompt);

      setGameState({
        story: response.story,
        choices: response.choices,
        inventory: response.inventory,
        quest: response.quest,
        image: newImage,
      });

      const modelTurn: StoryTurn = {
        role: 'model',
        parts: [{ text: JSON.stringify(response) }],
      };
      setHistory([...newHistory, modelTurn]);

    } catch (error) {
      console.error("Failed to process choice:", error);
      const errorStory = language === 'ko' ? "오류가 발생했습니다. 다른 선택을 하거나 페이지를 새로고침 해주세요." : "An error occurred. Please try a different choice or refresh the page.";
      setGameState(prev => ({...prev, story: errorStory, choices: []}));
    } finally {
      setLoading(false);
    }
  };
  
  const handleLanguageChange = (lang: 'en' | 'ko') => {
      setLanguage(lang);
  }

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen font-sans">
      <header className="bg-brand-surface p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-brand-primary">{t[language].title}</h1>
        <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold">{t[language].language}:</span>
            <button onClick={() => handleLanguageChange('en')} className={`px-3 py-1 rounded-md text-sm transition-colors ${language === 'en' ? 'bg-brand-primary text-white' : 'bg-brand-bg hover:bg-gray-700'}`}>EN</button>
            <button onClick={() => handleLanguageChange('ko')} className={`px-3 py-1 rounded-md text-sm transition-colors ${language === 'ko' ? 'bg-brand-primary text-white' : 'bg-brand-bg hover:bg-gray-700'}`}>KO</button>
        </div>
      </header>
      <div className="flex flex-col md:flex-row max-w-screen-2xl mx-auto">
        <StoryView
          story={gameState.story}
          image={gameState.image}
          choices={gameState.choices}
          onChoiceSelected={handleChoice}
          loading={loading}
          language={language}
        />
        <Sidebar inventory={gameState.inventory} quest={gameState.quest} language={language} />
      </div>
    </div>
  );
};

export default App;
