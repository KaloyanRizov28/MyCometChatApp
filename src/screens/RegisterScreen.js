import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { registerWithCometChat } from '../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!uid.trim() || !name.trim()) {
      Alert.alert('Грешка', 'Моля, попълнете всички полета');
      return;
    }

    setIsLoading(true);
    try {
      await registerWithCometChat(uid.trim(), name.trim());
      setIsLoading(false);
      navigation.replace('Home');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Неуспешна регистрация', error.message || 'Неуспешна регистрация. Моля, опитайте отново.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.appName}>megdan</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Създаване на профил</Text>
          <Text style={styles.subtitleText}>Попълнете данните си</Text>
          
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
            <Text style={styles.inputLabel}>Име и фамилия</Text>
            <TextInput
              style={styles.input}
              placeholder="Въведете име и фамилия"
              placeholderTextColor="#8E8E93"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Имейл</Text>
            <TextInput
              style={styles.input}
              placeholder="Въведете имейл адрес"
              placeholderTextColor="#8E8E93"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
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

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.registerButtonText}>Регистрация</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>или</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Вход с имейл</Text>
          </TouchableOpacity>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              С регистрацията приемам{' '}
              <Text style={styles.termsLinkText}>Условията за ползване</Text>
              {' '}и{' '}
              <Text style={styles.termsLinkText}>Политиката за поверителност</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
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
  registerButton: {
    backgroundColor: '#614EC1',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  registerButtonText: {
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
  loginButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#614EC1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  termsText: {
    color: '#8E8E93',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLinkText: {
    color: '#614EC1',
    fontWeight: '500',
  },
});

export default RegisterScreen;