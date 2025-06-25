import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

type StylesTheme = Pick<Theme, 'colors' | 'spacing'>;

interface StylesParams extends StylesTheme {
  size: number;
}

/**
 * Crea los estilos del componente HamburgerIcon
 */
export const createStyles = ({ colors, spacing, size }: StylesParams) => StyleSheet.create({
  container: {
    padding: spacing.xs,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: size + spacing.xs * 2,
    height: size + spacing.xs * 2,
  },
  line: {
    width: size,
    height: 2,
    marginVertical: 1,
    borderRadius: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
