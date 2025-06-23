import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '@theme/colors';

interface LoadingIndicatorProps {
  message?: string;
}

/**
 * Componente para mostrar un indicador de carga con mensaje opcional
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Cargando...' 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    marginTop: 10,
    color: colors.text,
    fontSize: 16,
  },
});
