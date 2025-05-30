'use client';

import { OceanBackgroundProps } from './types';

export function OceanBackground({ customColors }: OceanBackgroundProps) {
  const gradientStyle = customColors
    ? {
        background: `linear-gradient(to bottom, ${customColors.primary}, ${customColors.secondary}, ${customColors.accent})`,
      }
    : undefined;

  return (
    <div
      className={
        customColors
          ? 'absolute inset-0 backdrop-blur-sm'
          : 'absolute inset-0 bg-gradient-to-b from-blue-400/30 via-blue-500/20 to-blue-600/30 backdrop-blur-sm'
      }
      style={gradientStyle}
    />
  );
}
