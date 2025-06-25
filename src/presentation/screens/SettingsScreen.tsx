import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWithSideMenu } from '@components/templates';
import { useTheme } from '@theme/useTheme';

const SettingsScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const styles = createStyles({ colors, spacing, typography });

  return (
    <ScreenWithSideMenu title="Ajustes">
      <View style={styles.container}>
        <Text style={styles.title}>Ajustes de la aplicación</Text>
        {/* Aquí se añadirán los ajustes configurables */}
      </View>
    </ScreenWithSideMenu>
  );
};

const createStyles = ({ colors, spacing, typography }: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.lg,
      justifyContent: 'flex-start',
    },
    title: {
      ...typography.h2,
      color: colors.primary,
      marginBottom: spacing.lg,
    },
  });

export default SettingsScreen;
