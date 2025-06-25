import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

type StylesTheme = Pick<Theme, 'colors' | 'layout' | 'spacing'>;

export const createStyles = ({ colors, layout, spacing }: StylesTheme) =>
  StyleSheet.create({
    searchContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.cardBackground,
      borderRadius: layout.borderRadius.medium,
    },
    searchInput: {
      flex: 1,
      height: layout.buttonHeight,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: layout.borderRadius.small,
      paddingHorizontal: spacing.sm,
      backgroundColor: colors.background,
      marginRight: spacing.sm,
      color: colors.text,
    },
    searchButton: {
      height: layout.buttonHeight,
    },
  });
