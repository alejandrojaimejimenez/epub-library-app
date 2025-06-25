import { TextStyle } from 'react-native';

export interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    secondaryDark: string;
    secondaryLight: string;
    accent: string;
    background: string;
    cardBackground: string;
    text: string;
    textLight: string;
    textSecondary: string;
    error: string;
    border: string;
    headerBg: string;
    shadow: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    h4: TextStyle;
    h5: TextStyle;
    body: TextStyle;
    bodySmall: TextStyle;
    caption: TextStyle;
  };
  layout: {
    headerHeight: number;
    buttonHeight: number;
    iconSize: {
      small: number;
      medium: number;
      large: number;
    };
    borderRadius: {
      small: number;
      medium: number;
      large: number;
    };
  };
}
