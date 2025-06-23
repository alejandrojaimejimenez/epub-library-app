import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuth } from '@hooks/useAuth';

interface LogoutButtonProps {
  style?: any;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ style }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={handleLogout}
    >
      <Text style={styles.buttonText}>Cerrar Sesión</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#D32F2F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default LogoutButton;
