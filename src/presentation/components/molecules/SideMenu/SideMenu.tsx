import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  ScrollView,
  Animated,
  BackHandler
} from 'react-native';
import { useTheme } from '@theme/useTheme';
import { useAuth } from '@hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createStyles } from './styles';
import type { ISideMenuProps, ISideMenuItem } from './types';

/**
 * Componente de menú lateral deslizable.
 * Proporciona navegación lateral con animación de entrada/salida.
 *
 * @example
 * ```tsx
 * <SideMenu
 *   isVisible={isMenuVisible}
 *   onClose={() => setMenuVisible(false)}
 *   width="80%"
 *   position="right"
 * />
 * ```
 */
const SideMenu: React.FC<ISideMenuProps> = ({
  isVisible,
  onClose,
  onBackdropPress,
  width = '75%',
  position = 'right',
  testID = 'side-menu',
}) => {
  const { colors, spacing, typography } = useTheme();
  const styles = createStyles({ colors, spacing, typography, menuWidth: width, position });
  const { logout } = useAuth();
  const navigation = useNavigation<any>();
  const route = useRoute();
  
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  // Elementos de menú con navegación real
  const menuItems: ISideMenuItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      icon: <Text style={styles.menuItemIcon}>🏠</Text>,
      onPress: () => {
        onClose();
        navigation.navigate('Home');
      },
      active: route?.name === 'Home',
    },
    {
      id: 'library',
      label: 'Biblioteca',
      icon: <Text style={styles.menuItemIcon}>📚</Text>,
      onPress: () => {
        onClose();
        navigation.navigate('Library');
      },
      active: route?.name === 'Library',
    },
  ];

  // Función de logout
  const handleLogout = async () => {
    try {
      onClose();
      await logout();
      // La navegación al login se manejará automáticamente por el AuthContext
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Animación de entrada/salida
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, slideAnim, opacityAnim]);

  // Manejar botón atrás de Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isVisible) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: position === 'left' ? [-300, 0] : [300, 0],
  });

  const handleBackdropPress = () => {
    if (onBackdropPress) {
      onBackdropPress();
    } else {
      onClose();
    }
  };

  const renderMenuItem = (item: ISideMenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.menuItem,
        item.active && styles.menuItemActive,
        item.disabled && styles.menuItemDisabled,
      ]}
      onPress={item.onPress}
      disabled={item.disabled}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      {item.icon && (
        <View style={styles.menuItemIcon}>
          {item.icon}
        </View>
      )}
      <Text
        style={[
          styles.menuItemText,
          item.active && styles.menuItemTextActive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      {/* Overlay/Backdrop */}
      <Animated.View
        style={[styles.overlay, { opacity: opacityAnim }]}
      >
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Menu Container */}
      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateX }],
          },
        ]}
        testID={testID}
      >
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Cerrar menú"
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {/* Menu Content */}
        <View style={styles.menuContent}>
          {/* Header */}
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Navegación</Text>
            <Text style={styles.menuSubtitle}>Biblioteca EPUB</Text>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuItemsList}>
            {menuItems.map(renderMenuItem)}
          </ScrollView>

          {/* Logout Button */}
          <View style={styles.menuFooter}>
            <TouchableOpacity
              style={styles.logoutItem}
              onPress={handleLogout}
              accessibilityRole="button"
              accessibilityLabel="Cerrar sesión"
            >
              <Text style={styles.menuItemIcon}>🚪</Text>
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

export default React.memo(SideMenu);
