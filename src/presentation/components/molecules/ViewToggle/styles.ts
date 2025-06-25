import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

type StylesTheme = Pick<Theme, 'colors' | 'layout' | 'spacing'>;

export const createStyles = ({ colors, layout, spacing }: StylesTheme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: layout.borderRadius.medium,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: layout.borderRadius.small,
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.text,
    fontSize: 14,
  },
  activeText: {
    color: colors.background,
  },
});
