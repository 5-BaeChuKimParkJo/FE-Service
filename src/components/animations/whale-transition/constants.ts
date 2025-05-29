// Size configurations
export const WHALE_SIZES = {
  sm: { width: 'w-16', height: 'h-10' },
  md: { width: 'w-24', height: 'h-16' },
  lg: { width: 'w-32', height: 'h-20' },
} as const;

// Speed configurations
export const ANIMATION_SPEEDS = {
  slow: { duration: 6, delay: 0.8 },
  normal: { duration: 4, delay: 0.5 },
  fast: { duration: 2.5, delay: 0.3 },
} as const;

// Color themes
export const COLOR_THEMES = {
  blue: {
    primary: 'rgba(59, 130, 246, 0.3)', // blue-500
    secondary: 'rgba(37, 99, 235, 0.2)', // blue-600
    accent: 'rgba(147, 197, 253, 0.3)', // blue-300
    whale: 'text-blue-500',
    bubbles: 'bg-blue-200/50',
    text: 'text-white',
    subtext: 'text-blue-200',
  },
  ocean: {
    primary: 'rgba(6, 182, 212, 0.3)', // cyan-500
    secondary: 'rgba(8, 145, 178, 0.2)', // cyan-600
    accent: 'rgba(103, 232, 249, 0.3)', // cyan-300
    whale: 'text-cyan-500',
    bubbles: 'bg-cyan-200/50',
    text: 'text-white',
    subtext: 'text-cyan-200',
  },
} as const;

// Default props
export const DEFAULT_PROPS = {
  title: '🐋 헤엄쳐서 이동 중...',
  subtitle: '찰날찰낙 파도처럼 쏟아지는 경매',
  whaleSize: 'md' as const,
  animationSpeed: 'normal' as const,
  colorTheme: 'blue' as const,
  showBackground: true,
  showWaves: true,
  showBubbles: true,
  showText: true,
  pausePosition: 0.8,
  exitDirection: 'right' as const,
  bubbleCount: 8,
} as const;

export const WHALE_VARIANTS = {
  hidden: {
    x: -200,
    opacity: 0,
    scale: 0.8,
  },
} as const;
