import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { loginWithCometChat } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!uid.trim()) {
      Alert.alert('Грешка', 'Моля, въведете потребителско име');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithCometChat(uid.trim());
      setIsLoading(false);
      navigation.replace('Home');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Неуспешно влизане', error.message || 'Неуспешно влизане. Моля, опитайте отново.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.appName}>megdan</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Добре дошли обратно</Text>
        <Text style={styles.subtitleText}>Влезте във вашия профил</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Потребителско име</Text>
          <TextInput
            style={styles.input}
            placeholder="Въведете потребителско име"
            placeholderTextColor="#8E8E93"
            value={uid}
            onChangeText={setUid}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Парола</Text>
          <TextInput
            style={styles.input}
            placeholder="Въведете парола"
            placeholderTextColor="#8E8E93"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Забравена парола?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Вход</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>или</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerButtonText}>Регистрация</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#614EC1',
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#000000',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#614EC1',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#614EC1',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#8E8E93',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#614EC1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;