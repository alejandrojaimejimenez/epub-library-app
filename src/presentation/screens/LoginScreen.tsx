import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '@hooks/useAuth';
import { AuthStackParamList } from '@navigation/AuthNavigator';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    try {
      console.log('🔄 Iniciando proceso de login...');
      console.log('📝 Datos de login:', { username, password: '****' });
      
      await login({ username, password });
      
      console.log('✅ Login exitoso');
      // La navegación se manejará automáticamente en AuthNavigator
      // cuando isAuthenticated cambie a true
      
    } catch (err) {
      console.error('❌ Error en login:', err);
      console.error('Detalles del error:', {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err)
      });
      
      Alert.alert(
        'Error de autenticación', 
        `No se pudo iniciar sesión: ${err instanceof Error ? err.message : 'Error desconocido'}`
      );
    }
  };

  const navigateToRegister = () => {
    clearError();
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <View style={styles.inputContainer}>          <Text style={styles.label}>Usuario o Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su nombre de usuario o email"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={styles.registerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#757575',
    marginRight: 5,
  },
  registerLink: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default LoginScreen;
