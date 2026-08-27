import React from 'react';

interface PureGhorLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  taglineText?: string;
  lightMode?: boolean; // When placed on dark background (e.g. footer)
}

export const PureGhorLogo: React.FC<PureGhorLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  taglineText = '১০০% খাঁটি ও অর্গানিক',
  lightMode = false,
}) => {
  // Sizing scales
  const sizeMap = {
    sm: {
      text: 'text-xl tracking-tight',
      leaf: 'w-4 h-4 -top-2 left-[26px]',
      tagline: 'text-[9px]',
      height: 'h-7',
    },
    md: {
      text: 'text-2xl sm:text-[28px] tracking-tight',
      leaf: 'w-5 h-5 -top-2.5 left-[34px] sm:left-[39px]',
      tagline: 'text-[10px] sm:text-[11px]',
      height: 'h-8 sm:h-9',
    },
    lg: {
      text: 'text-3xl sm:text-4xl tracking-tight',
      leaf: 'w-6 h-6 -top-3 left-[48px] sm:left-[54px]',
      tagline: 'text-xs',
      height: 'h-10 sm:h-12',
    },
    xl: {
      text: 'text-4xl sm:text-5xl tracking-tight',
      leaf: 'w-8 h-8 -top-4 left-[64px] sm:left-[72px]',
      tagline: 'text-sm',
      height: 'h-14 sm:h-16',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="relative flex items-center leading-none">
        {/* Leaf icon positioned above the 'u' */}
        <div className={`absolute ${currentSize.leaf} pointer-events-none z-10 animate-pulse-slow`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm fill-current">
            <path
              d="M20,85 C20,40 50,15 90,10 C85,55 55,85 20,85 Z"
              fill={lightMode ? '#86efac' : '#52b202'}
            />
            {/* Center vein */}
            <path
              d="M20,85 C45,60 65,40 90,10"
              stroke={lightMode ? '#14532d' : '#ffffff'}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Brand Text: Pure (Dark Forest Green) + Ghor (Vibrant Fresh Green) */}
        <div className={`font-black font-sans flex items-center ${currentSize.text} ${currentSize.height}`}>
          <span
            className={
              lightMode
                ? 'text-white'
                : 'text-[#004e1c]'
            }
            style={{ fontWeight: 900, letterSpacing: '-0.03em' }}
          >
            Pure
          </span>
          <span
            className={
              lightMode
                ? 'text-[#4ade80]'
                : 'text-[#52b202]'
            }
            style={{ fontWeight: 900, letterSpacing: '-0.03em' }}
          >
            Ghor
          </span>
        </div>
      </div>

      {showTagline && (
        <span
          className={`font-semibold tracking-wider transition-colors ${currentSize.tagline} ${
            lightMode ? 'text-gray-300' : 'text-gray-500'
          }`}
        >
          {taglineText}
        </span>
      )}
    </div>
  );
};
