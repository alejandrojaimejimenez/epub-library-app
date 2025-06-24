import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@theme/useTheme';

export interface ILoadingIndicatorProps {
  message?: string;
}

/**
 * Componente para mostrar un indicador de carga con mensaje opcional
 * A diferencia del componente Loading, está orientado a mostrar estados de carga dentro
 * de componentes específicos, no necesariamente en pantalla completa
 */
const LoadingIndicator: React.FC<ILoadingIndicatorProps> = ({ 
  message = 'Cargando...' 
}) => {
  const { colors, spacing, typography } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    text: {
      marginTop: spacing.sm,
      color: colors.text,
      fontSize: typography.bodySmall.fontSize,
      fontWeight: typography.bodySmall.fontWeight as "400",
      lineHeight: typography.bodySmall.lineHeight,
    }
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

export default LoadingIndicator;
