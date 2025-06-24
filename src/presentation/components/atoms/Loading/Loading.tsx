import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@theme/useTheme';

export interface ILoadingProps {
  text?: string;
  fullScreen?: boolean;
}

/**
 * Componente para mostrar un indicador de carga
 * Puede ocupar toda la pantalla o solo una parte según sea necesario
 */
const Loading: React.FC<ILoadingProps> = ({ 
  text = 'Cargando...', 
  fullScreen = true 
}) => {
  const { colors, spacing, typography } = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fullScreen: {
      flex: 1,
      backgroundColor: colors.background,
    },    text: {
      marginTop: spacing.sm,
      color: colors.text,
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight as "400",
      lineHeight: typography.body.lineHeight,
    }
  });

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Loading;
