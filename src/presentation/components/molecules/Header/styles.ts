import { StyleSheet, Platform } from 'react-native';
import type { Theme } from '@theme/types';

/**
 * Constantes de estilo específicas del Header
 * Extraídas para mejor mantenimiento y reutilización
 */
const HEADER_CONSTANTS = {
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  shadowOffsetWidth: 0,
  shadowOffsetHeight: 2,
} as const;

/**
 * Crea los estilos del componente Header basados en el tema actual
 *
 * @param theme - Tema actual de la aplicación
 * @returns StyleSheet object con los estilos del header
 */



type StylesTheme = Pick<Theme, 'colors' | 'layout' | 'spacing' | 'typography'>;

export const createStyles = ({ colors, layout, spacing, typography }: StylesTheme) => StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: layout.headerHeight,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.headerBg,
      elevation: 3,
      ...(Platform.OS === 'web' 
        ? { 
            boxShadow: `0 ${HEADER_CONSTANTS.shadowOffsetHeight}px ${HEADER_CONSTANTS.shadowRadius}px rgba(0, 0, 0, ${HEADER_CONSTANTS.shadowOpacity})` 
          }
        : {
            shadowColor: colors.shadow,
            shadowOffset: {
              width: HEADER_CONSTANTS.shadowOffsetWidth,
              height: HEADER_CONSTANTS.shadowOffsetHeight,
            },
            shadowOpacity: HEADER_CONSTANTS.shadowOpacity,
            shadowRadius: HEADER_CONSTANTS.shadowRadius,
          }
      ),
      shadowRadius: HEADER_CONSTANTS.shadowRadius,
    },
    titleContainer: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: spacing.sm,
    },
    title: {
      ...typography.h5,
      color: colors.textLight,
    },
    leftComponent: {
      minWidth: spacing.xl,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    rightComponent: {
      minWidth: spacing.xl,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    backButton: {
      fontSize: typography.h5.fontSize,
      color: colors.textLight,
      padding: spacing.xs,
    },
    rightComponentWithMenu: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
