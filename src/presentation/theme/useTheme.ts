import { colors } from './colors';

// Definiciones de espaciado
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Tipografía básica
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};

// Radios y bordes
export const borders = {
  radius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  width: {
    thin: 1,
    normal: 2,
    thick: 3,
  },
};

// Hook para acceder al tema
export const useTheme = () => {
  return {
    colors,
    spacing,
    typography,
    borders,
  };
};

export default useTheme;
