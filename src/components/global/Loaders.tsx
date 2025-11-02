import React, { useState, useEffect } from 'react';

interface GreenConfirmationLoaderProps {
  isVisible: boolean;
  onComplete?: () => void;
  loadingDuration?: number;
}

const GreenConfirmationLoader: React.FC<GreenConfirmationLoaderProps> = ({
  isVisible,
  onComplete,
  loadingDuration = 3000,
}) => {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsComplete(false);
      const timer = setTimeout(() => {
        setIsComplete(true);
        if (onComplete) {
          setTimeout(onComplete, 1000);
        }
      }, loadingDuration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, loadingDuration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          isComplete ? 'bg-green-500' : 'bg-black/80 backdrop-blur-sm'
        }`}
      />

      {/* Loader Content */}
      <div className="relative z-10 flex flex-col items-center justify-center ">
        <div
          className={`w-20 h-20 border-4 rounded-full relative transition-all duration-500 ${
            isComplete ? 'border-white bg-green-500' : 'border-gray-700'
          }`}
        >
          {!isComplete && (
            <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
          )}

          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
              isComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
                className={isComplete ? 'animate-pulse' : ''}
              />
            </svg>
          </div>
        </div>

        {/* Status Text */}
        <div className="mt-6 text-center">
          <p
            className={`font-instrument text-sm md:text-xl font-medium transition-colors duration-500 ${
              isComplete ? 'text-white' : 'text-green-400'
            }`}
          >
            {isComplete ? 'Payment Successful!' : 'Processing Payment...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GreenConfirmationLoader;
