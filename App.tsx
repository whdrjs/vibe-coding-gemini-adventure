import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import StoryView from './components/StoryView';
import LoadingSpinner from './components/LoadingSpinner';
import { getNextStoryPart, generateImage } from './services/geminiService';
import { GameState, StoryTurn, GeminiResponse } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [history, setHistory] = useState<StoryTurn[]>([]);
  const [isTurnLoading, setTurnLoading] = useState<boolean>(true);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<'en' | 'ko'>('en');
  const [storyModel, setStoryModel] = useState<'gemini-2.5-flash' | 'gemini-2.5-pro'>('gemini-2.5-flash');
  const [imageModel, setImageModel] = useState<'imagen-4.0-generate-001' | 'gemini-2.5-flash-image'>('imagen-4.0-generate-001');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const processTurn = useCallback(async (choice: string, currentHistory: StoryTurn[]) => {
    setTurnLoading(true);
    setIsImageLoading(true);

    try {
      // Phase 1: Get story text and choices first for a responsive UI
      const storyResponse: GeminiResponse = await getNextStoryPart(currentHistory, choice, language, storyModel);

      // Update the game state with new text, but keep the old image temporarily
      setGameState(prevState => ({
        story: storyResponse.story,
        choices: storyResponse.choices,
        inventory: storyResponse.inventory,
        quest: storyResponse.quest,
        image: prevState?.image || '', // Keep old image or empty string
      }));

      const modelTurn: StoryTurn = {
        role: 'model',
        parts: [{ text: JSON.stringify(storyResponse) }],
      };
      const userTurn: StoryTurn = {
        role: 'user',
        parts: [{ text: choice }],
      };
      setHistory([...currentHistory, userTurn, modelTurn]);

      // Phase 2: Generate the image in the background
      const imageUrl = await generateImage(storyResponse.imagePrompt, imageModel);
      
      // Update the game state again, this time with the new image
      setGameState(prevState => prevState ? { ...prevState, image: imageUrl } : null);
      setIsImageLoading(false);

    } catch (error) {
      console.error("Error processing turn:", error);
      // Optionally set an error state to show a message to the user
    } finally {
      setTurnLoading(false); // Re-enable choices only after everything is loaded
    }
  }, [language, storyModel, imageModel]);

  const startGame = useCallback(() => {
    const initialPrompt = language === 'ko' 
      ? "새로운 판타지 모험 게임을 시작해 주세요. 마법에 걸린 숲에서 시작합니다."
      : "Start a new fantasy adventure game for me. Begin in an enchanted forest.";
    setHistory([]);
    setGameState(null);
    processTurn(initialPrompt, []);
  }, [processTurn, language]);

  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); // Restart game when language changes

  const handleChoice = (choice: string) => {
    if (isTurnLoading) return; // Prevent multiple clicks while processing
    processTurn(choice, history);
  };
  
  const handleNewGame = () => {
    setSidebarOpen(false);
    startGame();
  }

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen font-sans">
       <header className="p-4 md:px-8 md:py-6 flex justify-between items-center sticky top-0 bg-brand-bg/80 backdrop-blur-sm z-30">
        <h1 className="text-xl md:text-3xl font-bold text-brand-primary font-serif">
          Infinite Adventure
        </h1>
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-brand-surface focus:outline-none focus:ring-2 focus:ring-brand-primary z-50"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </header>

      <main className="container mx-auto px-4 md:px-8 pb-8">
          {(isTurnLoading || isImageLoading) && !gameState ? (
             <div className="flex justify-center items-center h-full min-h-[60vh]">
              <LoadingSpinner />
            </div>
          ) : gameState ? (
            <StoryView
              story={gameState.story}
              image={gameState.image}
              choices={gameState.choices}
              onChoice={handleChoice}
              isTurnLoading={isTurnLoading}
              isImageLoading={isImageLoading}
            />
          ) : (
            <div className="text-center py-20">Failed to load game. Please refresh.</div>
          )}
      </main>

       {/* Overlay */}
       <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      
      {gameState && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          inventory={gameState.inventory}
          quest={gameState.quest}
          language={language}
          setLanguage={setLanguage}
          storyModel={storyModel}
          setStoryModel={setStoryModel}
          imageModel={imageModel}
          setImageModel={setImageModel}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
};

export default App;