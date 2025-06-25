import { StyleSheet, Dimensions } from 'react-native';
import type { Theme } from '@theme/types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type StylesTheme = Pick<Theme, 'colors' | 'spacing' | 'typography'>;

interface StylesParams extends StylesTheme {
  menuWidth: string | number;
  position: 'left' | 'right';
}

/**
 * Crea los estilos del componente SideMenu
 */
export const createStyles = ({ colors, spacing, typography, menuWidth, position }: StylesParams) => {
  const widthValue = typeof menuWidth === 'string' 
    ? menuWidth.includes('%') 
      ? (screenWidth * parseFloat(menuWidth) / 100)
      : screenWidth * 0.75
    : menuWidth;

  return StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
    },
    menuContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: widthValue,
      backgroundColor: colors.background,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: position === 'left' ? 2 : -2,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      elevation: 5,
      zIndex: 1001,
      ...(position === 'left' ? { left: 0 } : { right: 0 }),
    },
    menuContent: {
      flex: 1,
      paddingTop: spacing.xl,
    },
    menuHeader: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuTitle: {
      ...typography.h4,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    menuSubtitle: {
      ...typography.body,
      color: colors.textSecondary,
    },
    menuItemsList: {
      flex: 1,
      paddingTop: spacing.md,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemActive: {
      backgroundColor: colors.primaryLight,
    },
    menuItemDisabled: {
      opacity: 0.5,
    },
    menuItemIcon: {
      marginRight: spacing.md,
      width: 24,
      alignItems: 'center',
      fontSize: 20,
    },
    menuItemText: {
      ...typography.body,
      color: colors.text,
      flex: 1,
    },
    menuItemTextActive: {
      color: colors.primary,
      fontWeight: '600',
    },
    closeButton: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      padding: spacing.sm,
      zIndex: 1002,
    },
    closeButtonText: {
      ...typography.h5,
      color: colors.textSecondary,
    },
    menuFooter: {
      padding: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: spacing.sm,
    },
    logoutButton: {
      backgroundColor: 'transparent',
      paddingVertical: 0,
    },
    logoutItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: spacing.xs,
    },
    logoutText: {
      ...typography.body,
      color: colors.error,
      fontWeight: '600',
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: spacing.xs,
      marginBottom: spacing.xs,
    },
    settingsText: {
      ...typography.body,
      color: colors.text,
      fontWeight: '500',
    },
  });
};
