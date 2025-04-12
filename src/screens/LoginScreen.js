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
} from 'react-native';
import { loginWithCometChat } from '../services/authService';
import { COLORS } from '../theme/colors';

const LoginScreen = ({ navigation }) => {
  const [uid, setUid] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!uid.trim()) {
      Alert.alert('Error', 'Please enter a user ID');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithCometChat(uid.trim());
      setIsLoading(false);
      navigation.replace('Home');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Login Failed', error.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Welcome Back</Text>
        <Text style={styles.headerSubtitle}>Login to connect with friends</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>User ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your User ID"
            value={uid}
            onChangeText={setUid}
            autoCapitalize="none"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.TEXT_LIGHT} />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.linkText}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  headerContainer: {
    backgroundColor: COLORS.PRIMARY,
    padding: 40,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    shadowColor: COLORS.DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_LIGHT,
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.TEXT_LIGHT,
    opacity: 0.8,
  },
  formContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    color: COLORS.TEXT_PRIMARY,
  },
  button: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: COLORS.DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.TEXT_LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
  },
  linkText: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
});

export default LoginScreen;