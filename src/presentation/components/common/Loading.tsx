import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ text = 'Cargando...', fullScreen = true }) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default Loading;
