import { CometChat } from '@cometchat-pro/react-native-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COMETCHAT_CONSTANTS } from '../config';

// Initialize CometChat
export const initCometChat = async () => {
  const appSettings = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(COMETCHAT_CONSTANTS.REGION)
    .build();

  try {
    await CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSettings);
    console.log('CometChat initialization completed successfully');
    return true;
  } catch (error) {
    console.log('CometChat initialization failed with error:', error);
    return false;
  }
};

// Login user to CometChat
export const loginWithCometChat = async (uid, displayName = '') => {
  try {
    const user = await CometChat.login(uid, COMETCHAT_CONSTANTS.AUTH_KEY);
    console.log('CometChat Login Successful:', { user });
    await AsyncStorage.setItem('auth_user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.log('CometChat Login Failed:', error);
    throw error;
  }
};

// Register user with CometChat
export const registerWithCometChat = async (uid, name) => {
  try {
    // Create user object
    const user = new CometChat.User(uid);
    user.setName(name);

    // Register user
    const registeredUser = await CometChat.createUser(user, COMETCHAT_CONSTANTS.AUTH_KEY);
    console.log('CometChat Registration Successful:', registeredUser);
    
    // Login after successful registration
    return await loginWithCometChat(uid);
  } catch (error) {
    console.log('CometChat Registration Failed:', error);
    throw error;
  }
};

// Logout from CometChat
export const logoutFromCometChat = async () => {
  try {
    await CometChat.logout();
    await AsyncStorage.removeItem('auth_user');
    console.log('CometChat Logout Successful');
    return true;
  } catch (error) {
    console.log('CometChat Logout Failed:', error);
    throw error;
  }
};

// Check if user is already logged in
export const checkAuthStatus = async () => {
  try {
    const authData = await AsyncStorage.getItem('auth_user');
    if (authData) {
      return JSON.parse(authData);
    }
    return null;
  } catch (error) {
    console.log('Auth status check failed:', error);
    return null;
  }
};