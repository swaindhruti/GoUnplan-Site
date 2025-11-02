'use client';
import React, { ReactNode } from 'react';
import DotGrid from '../texture-background/dotGrid';

interface DotGridBackgroundProviderProps {
  children: ReactNode;
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  shockRadius?: number;
  shockStrength?: number;
  resistance?: number;
  returnDuration?: number;
  height?: string | number;
}

const DotGridBackgroundProvider: React.FC<DotGridBackgroundProviderProps> = ({
  children,
  dotSize = 4,
  gap = 15,
  baseColor = '#c3c3c3',
  activeColor = '#5227FF',
  proximity = 140,
  shockRadius = 250,
  shockStrength = 5,
  resistance = 750,
  returnDuration = 1.5,
  height = '100vh',
}) => {
  return (
    <div className="relative w-full" style={{ minHeight: height }}>
      {/* Background layer */}
      <div className="absolute inset-0 w-full h-full z-0">
        <DotGrid
          dotSize={dotSize}
          gap={gap}
          baseColor={baseColor}
          activeColor={activeColor}
          proximity={proximity}
          shockRadius={shockRadius}
          shockStrength={shockStrength}
          resistance={resistance}
          returnDuration={returnDuration}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default DotGridBackgroundProvider;
