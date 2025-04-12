import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { registerWithCometChat } from '../services/authService';
import { COLORS } from '../theme/colors';

const RegisterScreen = ({ navigation }) => {
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!uid.trim() || !name.trim()) {
      Alert.alert('Error', 'Please enter both User ID and Name');
      return;
    }

    setIsLoading(true);
    try {
      await registerWithCometChat(uid.trim(), name.trim());
      setIsLoading(false);
      navigation.replace('Home');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Registration Failed', error.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>Join our growing community</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>User ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a unique User ID"
            value={uid}
            onChangeText={setUid}
            autoCapitalize="none"
            placeholderTextColor={COLORS.TEXT_SECONDARY}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your display name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={COLORS.TEXT_SECONDARY}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.TEXT_LIGHT} />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.linkText}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  contentContainer: {
    flexGrow: 1,
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
    marginBottom: 20,
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
    marginTop: 24,
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
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
  },
  linkText: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;