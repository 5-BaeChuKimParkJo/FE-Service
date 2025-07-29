import { Variants } from 'framer-motion';

export interface WhaleTransitionProps {
  isActive: boolean;
  onComplete?: () => void;

  title?: string;
  subtitle?: string;
  whaleSize?: 'sm' | 'md' | 'lg';
  animationSpeed?: 'slow' | 'normal' | 'fast';
  colorTheme?: 'blue' | 'ocean' | 'custom';

  showBackground?: boolean;
  showWaves?: boolean;
  showBubbles?: boolean;
  showText?: boolean;

  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };

  pausePosition?: number; // 0-1, where to pause the whale
  exitDirection?: 'right' | 'left' | 'up' | 'down';
}

export interface SwimmingWhaleProps {
  variants: Variants;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

export interface BubbleTrailProps {
  count?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  speed?: 'slow' | 'normal' | 'fast';
}

export interface OceanBackgroundProps {
  colorTheme?: 'blue' | 'ocean' | 'custom';
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface WaveEffectProps {
  intensity?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'normal' | 'fast';
  colorTheme?: 'blue' | 'ocean' | 'custom';
  customColor?: string;
}
