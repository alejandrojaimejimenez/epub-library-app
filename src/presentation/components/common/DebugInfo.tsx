import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { colors } from '../../theme/colors';

interface DebugInfoProps {
  visible: boolean;
  bookId?: string;
  actions: {
    label: string;
    action: () => void;
  }[];
  logs: string[];
}

const DebugInfo: React.FC<DebugInfoProps> = ({ visible, bookId, actions, logs }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Depuración</Text>
      
      {bookId && (
        <Text style={styles.info}>ID del libro: {bookId}</Text>
      )}
      
      <View style={styles.actionsContainer}>
        {actions.map((action, index) => (
          <Button 
            key={index} 
            title={action.label} 
            onPress={action.action} 
            color={colors.accent}
          />
        ))}
      </View>
      
      <ScrollView style={styles.logsContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logEntry}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    maxHeight: 300,
    zIndex: 1000,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    color: 'yellow',
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-around',
  },
  logsContainer: {
    maxHeight: 200,
  },
  logEntry: {
    color: 'white',
    fontSize: 12,
    marginBottom: 2,
  },
});

export default DebugInfo;
