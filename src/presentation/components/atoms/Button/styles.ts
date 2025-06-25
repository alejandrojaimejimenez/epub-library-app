import { StyleSheet } from 'react-native';
import { Theme } from '@theme/types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.layout.borderRadius.small,
      backgroundColor: theme.colors.primary,
    },
    small: {
      height: theme.layout.buttonHeight * 0.8,
      paddingHorizontal: theme.spacing.sm,
    },
    medium: {
      height: theme.layout.buttonHeight,
      paddingHorizontal: theme.spacing.md,
    },
    large: {
      height: theme.layout.buttonHeight * 1.2,
      paddingHorizontal: theme.spacing.lg,
    },
    text: {
      ...theme.typography.body,
      color: theme.colors.background,
    },
    textDisabled: {
      color: theme.colors.textLight,
    },
  });
