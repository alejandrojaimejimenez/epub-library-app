import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/useTheme';
import { HamburgerIcon } from '@components/atoms';
import { createStyles } from './styles';
import type { IHeaderProps } from './types';

/**
 * Componente de encabezado para pantallas.
 * Permite mostrar un título central y componentes opcionales a los lados.
 * Puede incluir un botón de retroceso en la parte izquierda.
 *
 * @example
 * ```tsx
 * <Header
 *   title="Mi Pantalla"
 *   showBackButton
 *   onBackPress={() => navigation.goBack()}
 *   rightComponent={<MyCustomButton />}
 * />
 * ```
 */
const Header: React.FC<IHeaderProps> = ({ 
  title, 
  rightComponent, 
  leftComponent,
  showBackButton = false,
  onBackPress,
  showHamburgerMenu = false,
  onHamburgerPress
}) => {
    const { colors, layout, spacing, typography } = useTheme();
    const styles = createStyles({ colors, layout, spacing, typography });

  const renderLeftComponent = () => {
    if (leftComponent) return leftComponent;
    
    if (showBackButton) {
      return (
        <TouchableOpacity 
          onPress={onBackPress}
          accessibilityRole="button"
          accessibilityLabel="Volver atrás"
        >
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      );
    }
    
    return null;
  };

  const renderRightComponent = () => {
    if (rightComponent && !showHamburgerMenu) return rightComponent;
    
    if (showHamburgerMenu) {
      return (
        <View style={styles.rightComponentWithMenu}>
          {rightComponent}
          <View style={{ marginLeft: rightComponent ? spacing.sm : 0 }}>
            <HamburgerIcon 
              onPress={onHamburgerPress || (() => {})}
              color={colors.textLight}
              size={24}
            />
          </View>
        </View>
      );
    }
    
    return rightComponent;
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftComponent}>
        {renderLeftComponent()}
      </View>
      <View style={styles.titleContainer}>
        <Text 
          style={styles.title} 
          numberOfLines={1}
          accessibilityRole="header"
        >
          {title}
        </Text>
      </View>
      <View style={styles.rightComponent}>
        {renderRightComponent()}
      </View>
    </View>
  );
};

export default React.memo(Header);
