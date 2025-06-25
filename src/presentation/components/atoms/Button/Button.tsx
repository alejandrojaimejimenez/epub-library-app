import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@theme/useTheme';
import { IButtonProps } from './types';

/**
 * Componente de botón reutilizable
 * Sigue las guías de diseño del sistema utilizando el hook useTheme
 */
const Button: React.FC<IButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID
}) => {
  const { colors, spacing, borders } = useTheme();

  // Generar estilos según las propiedades
  const getContainerStyle = () => {
    const baseStyle = {
      borderRadius: borders.radius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' as const : undefined,
    };

    // Aplicar estilos según la variante
    const variantStyles = {
      primary: {
        backgroundColor: colors.primary,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: colors.secondary,
        borderWidth: 0,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: borders.width.thin,
        borderColor: colors.primary,
      },
    };

    // Aplicar estilos según el tamaño
    const sizeStyles = {
      small: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
      },
      medium: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
      },
      large: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant as keyof typeof variantStyles],
      ...sizeStyles[size as keyof typeof sizeStyles],
    };
  };

  // Generar estilos para el texto según las propiedades
  const getTextStyle = () => {
    const baseStyle = {
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    };

    // Aplicar estilos según la variante
    const variantStyles = {
      primary: {
        color: colors.textLight,
      },
      secondary: {
        color: colors.textLight,
      },
      outline: {
        color: colors.primary,
      },
    };

    // Aplicar estilos según el tamaño
    const sizeStyles = {
      small: {
        fontSize: 12,
      },
      medium: {
        fontSize: 14,
      },
      large: {
        fontSize: 16,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant as keyof typeof variantStyles],
      ...sizeStyles[size as keyof typeof sizeStyles],
    };
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? colors.primary : colors.textLight} 
          style={{ marginRight: title ? spacing.xs : 0 }} 
        />
      ) : null}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
