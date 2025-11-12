import React from 'react';
import ChoiceButton from './ChoiceButton';
import LoadingSpinner from './LoadingSpinner';

interface StoryViewProps {
  story: string;
  image: string;
  choices: string[];
  onChoiceSelected: (choice: string) => void;
  loading: boolean;
  language: 'en' | 'ko';
}

const StoryView: React.FC<StoryViewProps> = ({
  story,
  image,
  choices,
  onChoiceSelected,
  loading,
  language,
}) => {
    
  const t = {
      en: {
          your_turn: "What do you do next?",
          loading_story: "Weaving the threads of fate..."
      },
      ko: {
          your_turn: "다음엔 무엇을 하시겠습니까?",
          loading_story: "운명의 실을 잣는 중..."
      }
  }

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="mb-8">
        <div className="aspect-video bg-brand-surface rounded-lg mb-6 overflow-hidden shadow-lg flex items-center justify-center relative">
          {loading && !image && <LoadingSpinner />}
          {image && <img src={image} alt="Current scene" className="w-full h-full object-cover" />}
          {loading && image && <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"><LoadingSpinner/></div>}
        </div>
        <p className="text-brand-text-light text-lg leading-relaxed min-h-[72px]">{story}</p>
      </div>
      
      <div className="min-h-[150px]">
        {loading ? (
          <div className="flex justify-center items-center my-8">
              <div className="flex flex-col items-center">
                  <LoadingSpinner />
                  <p className="mt-4 text-brand-primary">
                      {t[language].loading_story}
                  </p>
              </div>
          </div>
        ) : (
          choices.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-brand-primary">{t[language].your_turn}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {choices.map((choice, index) => (
                  <ChoiceButton
                    key={index}
                    text={choice}
                    onClick={() => onChoiceSelected(choice)}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default StoryView;
