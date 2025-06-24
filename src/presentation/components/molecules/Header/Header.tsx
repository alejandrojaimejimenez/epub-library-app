import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@theme/useTheme';

export interface IHeaderProps {
  title: string;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
}

/**
 * Componente de encabezado para pantallas
 * Permite incluir componentes a la izquierda y derecha del título
 */
const Header: React.FC<IHeaderProps> = ({ 
  title, 
  rightComponent, 
  leftComponent 
}) => {
  const { colors, spacing, typography } = useTheme();

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.headerBg,
      elevation: 3,
      // shadowColor, shadowOffset, etc. se aplicarán dinámicamente
    },
    leftContainer: {
      flex: 1,
      alignItems: 'flex-start',
    },
    titleContainer: {
      flex: 3,
      alignItems: 'center',
    },
    rightContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    title: {
      color: colors.textLight,
      fontSize: typography.h3.fontSize,
      fontWeight: typography.h3.fontWeight as "600",
      textAlign: 'center',
    }
  });

  // Aplicar estilos según la plataforma
  const headerStyle = [
    styles.header,
    // Aplicar sombras para iOS/Web
    Platform.OS !== 'android' && {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    }
  ];

  return (
    <View style={headerStyle}>
      <View style={styles.leftContainer}>
        {leftComponent}
      </View>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      
      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

export default Header;
