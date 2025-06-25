import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '@hooks/useAuth';
import { AuthStackParamList } from '@navigation/AuthNavigator';
import { useApiHealthcheck } from '@hooks/useApiHealthcheck';
import { getApiBaseUrl, setApiBaseUrlCustom, API_BASE_URL, API_BASE_URL_CUSTOM } from '@constants/config';
import { SUserLocalStorage } from '@storage/UserLocalStorage';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [apiUrl, setApiUrl] = useState<string>(API_BASE_URL_CUSTOM || API_BASE_URL);
  const { register, isLoading, error, clearError } = useAuth();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { isValid, isLoading: isValidatingApi, error: apiError, validate } = useApiHealthcheck();

  // Al montar, intenta cargar la url custom guardada
  React.useEffect(() => {
    SUserLocalStorage.get('api_url_custom').then((data) => {
      if (data && data.url) setApiUrl(data.url);
    });
  }, []);

  // Cuando se valida la API, guardar la url custom y actualizar config
  const handleValidateApi = async () => {
    // Guardar la url custom en storage y config antes de validar
    setApiBaseUrlCustom(apiUrl);
    await SUserLocalStorage.update({ id: 'api_url_custom', url: apiUrl });
    await validate();
  };

  const handleRegister = async () => {
    // Validaciones básicas
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Validación simple de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Formato de email inválido');
      return;
    }

    if (isValid !== true) {
      Alert.alert('Error', 'Debes validar la URL de la API antes de registrarte.');
      return;
    }
    try {
      console.log('Intentando registro con:', { username, email, password });
      await register({ username, email, password });
      Alert.alert('Éxito', 'Registro exitoso', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err) {
      console.error('Error al registrarse:', err);
      Alert.alert(
        'Error de registro', 
        `No se pudo completar el registro: ${err instanceof Error ? err.message : 'Error desconocido'}`
      );
    }
  };

  const navigateToLogin = () => {
    clearError();
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Crear Cuenta</Text>
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese un nombre de usuario"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
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
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirme su contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>URL de la API</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="http://localhost:3000"
                value={apiUrl}
                onChangeText={setApiUrl}
                autoCapitalize="none"
                keyboardType="url"
              />
              <TouchableOpacity
                style={{ marginLeft: 8, backgroundColor: '#2E7D32', padding: 10, borderRadius: 5 }}
                onPress={handleValidateApi}
                disabled={isValidatingApi}
              >
                {isValidatingApi ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Validar</Text>
                )}
              </TouchableOpacity>
            </View>
            {apiError && <Text style={styles.errorText}>{apiError}</Text>}
            {isValid && <Text style={{ color: '#2E7D32' }}>API válida</Text>}
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading || isValid !== true}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Registrarse</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#757575',
    marginRight: 5,
  },
  loginLink: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default RegisterScreen;
