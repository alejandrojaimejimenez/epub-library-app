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
    fontWeight: "700" as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  h5: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
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

// Dimensiones y layout
export const layout = {
  headerHeight: 56,
  buttonHeight: 48,
  iconSize: {
    small: 16,
    medium: 24,
    large: 32,
  },
  borderRadius: {
    small: borders.radius.sm,
    medium: borders.radius.md,
    large: borders.radius.lg,
  },
};

// Hook para acceder al tema
export const useTheme = () => {
  return {
    colors,
    spacing,
    typography,
    borders,
    layout,
  };
};

export default useTheme;
