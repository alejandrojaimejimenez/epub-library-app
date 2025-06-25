import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@theme/useTheme';
import { createStyles } from './styles';
import type { IHamburgerIconProps } from './types';

/**
 * Componente de icono hamburger para activar menús laterales.
 * Utiliza líneas horizontales para crear el icono clásico de hamburger menu.
 *
 * @example
 * ```tsx
 * <HamburgerIcon
 *   onPress={() => setMenuVisible(true)}
 *   color="white"
 * />
 * ```
 */
const HamburgerIcon: React.FC<IHamburgerIconProps> = ({
  onPress,
  color,
  size = 24,
  testID = 'hamburger-icon',
  disabled = false,
}) => {
  const { colors, spacing } = useTheme();
  const styles = createStyles({ colors, spacing, size });

  const iconColor = color || colors.textLight;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, disabled && styles.disabled]}
      accessibilityRole="button"
      accessibilityLabel="Abrir menú de navegación"
      accessibilityHint="Toca para abrir el menú lateral"
      testID={testID}
      disabled={disabled}
    >
      <View style={[styles.line, { backgroundColor: iconColor }]} />
      <View style={[styles.line, { backgroundColor: iconColor }]} />
      <View style={[styles.line, { backgroundColor: iconColor }]} />
    </TouchableOpacity>
  );
};

export default React.memo(HamburgerIcon);
