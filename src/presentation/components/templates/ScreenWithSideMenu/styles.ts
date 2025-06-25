import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

type StylesTheme = Pick<Theme, 'colors'>;

/**
 * Crea los estilos del componente ScreenWithSideMenu
 */
export const createStyles = ({ colors }: StylesTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
