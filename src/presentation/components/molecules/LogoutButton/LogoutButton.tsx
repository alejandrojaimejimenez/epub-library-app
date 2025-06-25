import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@theme/useTheme';
import Button from '@components/atoms/Button';

export interface ILogoutButtonProps {
  style?: ViewStyle;
}

/**
 * Botón específico para la acción de cerrar sesión
 * Utiliza el componente Button base con una configuración específica
 */
const LogoutButton: React.FC<ILogoutButtonProps> = ({ style }) => {
  const { logout } = useAuth();
  const { colors } = useTheme();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button 
      title="Cerrar Sesión"
      onPress={handleLogout}
      variant="primary"
      disabled={false}
      style={style}
    />
  );
};

export default LogoutButton;
