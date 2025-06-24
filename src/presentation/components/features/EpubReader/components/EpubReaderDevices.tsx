import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@presentation/theme/useTheme';

export interface EpubReaderDevicesProps {
  epubUrl: string;
  initialCfi: string;
  onLocationChange: (newCfi: string) => void;
}

/**
 * Componente para visualizar EPUB en dispositivos móviles
 * Por ahora es un stub, en el futuro implementará WebView
 */
const EpubReaderDevices: React.FC<EpubReaderDevicesProps> = (props) => {
  const { epubUrl, initialCfi, onLocationChange } = props;
  const { colors, spacing, typography } = useTheme();
  
  console.warn('EpubReaderDevices no implementado todavía', {
    epubUrl,
    initialCfi,
    onLocationChange: typeof onLocationChange
  });
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.lg }]}>
      <View style={styles.textContainer}>        <Text style={[
          styles.notImplementedText, 
          { fontSize: typography.h3.fontSize, fontWeight: 'bold', marginBottom: spacing.md }
        ]}>
          Lector de EPUB para dispositivos móviles
        </Text>
        <Text style={[
          styles.infoText, 
          { fontSize: typography.body.fontSize, color: colors.textSecondary }
        ]}>
          Esta funcionalidad será implementada próximamente usando WebView
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  notImplementedText: {
    textAlign: 'center',
  },
  infoText: {
    textAlign: 'center',
  },
});

export default EpubReaderDevices;
