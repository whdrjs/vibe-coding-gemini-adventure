import React, { useState } from 'react';
import ChoiceButton from './ChoiceButton';
import LoadingSpinner from './LoadingSpinner';

interface StoryViewProps {
  story: string;
  image: string;
  choices: string[];
  onChoice: (choice: string) => void;
  isTurnLoading: boolean;
  isImageLoading: boolean;
  choiceHistory: string[];
  language: 'en' | 'ko';
}

const StoryView: React.FC<StoryViewProps> = ({ story, image, choices, onChoice, isTurnLoading, isImageLoading, choiceHistory, language }) => {
  const [customChoice, setCustomChoice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customChoice.trim() && !isTurnLoading) {
      onChoice(customChoice.trim());
      setCustomChoice('');
    }
  };
  
  return (
    <section className="bg-brand-surface p-6 md:p-8 rounded-lg shadow-lg">
      <div className="aspect-video max-h-[50vh] mb-6 rounded-lg overflow-hidden shadow-md relative bg-black">
        {isImageLoading && (
           <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
              <LoadingSpinner/>
           </div>
        )}
        <img key={image} src={image} alt="Current scene" className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoading ? 'opacity-50' : 'opacity-100'}`} />
      </div>

      {choiceHistory.length > 0 && (
        <div className="mb-6 pb-4 border-b border-white/10">
          <h3 className="text-md font-bold text-brand-secondary mb-3 uppercase tracking-wider">
            {language === 'ko' ? '나의 여정' : 'Your Path'}
          </h3>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-brand-text-muted">
            {choiceHistory.map((choice, index) => (
              <React.Fragment key={index}>
                <span className="text-sm italic">"{choice}"</span>
                {index < choiceHistory.length - 1 && (
                  <span className="text-brand-primary font-bold">&rarr;</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <p className="text-brand-text-muted leading-relaxed whitespace-pre-wrap font-serif text-lg">{story}</p>

      <div className="mt-8 relative">
        {isTurnLoading && (
          <div className="absolute inset-0 bg-brand-surface bg-opacity-75 flex justify-center items-center z-10 rounded-lg">
            <LoadingSpinner />
          </div>
        )}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isTurnLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          {choices.map((choice, index) => (
            <ChoiceButton
              key={index}
              text={choice}
              onClick={() => onChoice(choice)}
              disabled={isTurnLoading}
            />
          ))}
        </div>
        
        <div className={`mt-6 pt-6 border-t border-white/10 ${isTurnLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          <p className="text-center text-brand-text-muted mb-4 font-serif italic">{language === 'ko' ? '나만의 행동을 입력하여 운명을 개척하세요' : 'Forge your own path by typing your action'}</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customChoice}
              onChange={(e) => setCustomChoice(e.target.value)}
              placeholder={language === 'ko' ? '예: 주변을 둘러본다' : 'e.g., Look around the room'}
              className="flex-grow bg-brand-bg border border-brand-primary/50 text-brand-text text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-4"
              disabled={isTurnLoading}
              aria-label={language === 'ko' ? '사용자 정의 선택 입력' : 'Custom choice input'}
            />
            <button
              type="submit"
              disabled={isTurnLoading || !customChoice.trim()}
              className="px-6 py-4 bg-brand-primary text-white font-bold rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {language === 'ko' ? '선택' : 'Go'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default StoryView;