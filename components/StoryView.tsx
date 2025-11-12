import React from 'react';
import ChoiceButton from './ChoiceButton';
import LoadingSpinner from './LoadingSpinner';

interface StoryViewProps {
  story: string;
  image: string;
  choices: string[];
  onChoice: (choice: string) => void;
  isTurnLoading: boolean;
  isImageLoading: boolean;
}

const StoryView: React.FC<StoryViewProps> = ({ story, image, choices, onChoice, isTurnLoading, isImageLoading }) => {
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
      </div>
    </section>
  );
};

export default StoryView;