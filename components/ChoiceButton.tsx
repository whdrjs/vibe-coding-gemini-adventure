
import React from 'react';

interface ChoiceButtonProps {
  text: string;
  onClick: () => void;
  disabled: boolean;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left p-4 bg-brand-bg rounded-lg border-2 border-transparent hover:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <p className="text-brand-text">{text}</p>
    </button>
  );
};

export default ChoiceButton;