import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@presentation/theme/useTheme';
import Button from '@presentation/components/atoms/Button';

interface DebugInfoProps {
  visible: boolean;
  bookId?: string;
  actions: {
    label: string;
    action: () => void;
  }[];
  logs: string[];
}

/**
 * Componente de depuración que muestra información y acciones útiles durante el desarrollo
 */
const DebugInfo: React.FC<DebugInfoProps> = ({ visible, bookId, actions, logs }) => {
  const { colors, spacing, typography } = useTheme();
  
  if (!visible) return null;

  return (
    <View style={[
      styles.container, 
      { backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: spacing.md }
    ]}>
      <Text style={[styles.title, { color: colors.textLight, fontSize: typography.h3.fontSize }]}>
        Depuración
      </Text>
      
      {bookId && (
        <Text style={[styles.info, { color: 'yellow', marginBottom: spacing.xs }]}>
          ID del libro: {bookId}
        </Text>
      )}
      
      <View style={[styles.actionsContainer, { marginBottom: spacing.sm }]}>
        {actions.map((action, index) => (          <Button 
            key={index} 
            title={action.label} 
            onPress={action.action} 
            variant="secondary"
            size="small"
          />
        ))}
      </View>
      
      <ScrollView style={styles.logsContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={[
            styles.logEntry, 
            { color: colors.textLight, fontSize: typography.caption.fontSize }
          ]}>
            {log}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: 300,
    zIndex: 1000,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  logsContainer: {
    maxHeight: 200,
  },
  logEntry: {
    marginBottom: 2,
  },
});

export default DebugInfo;
