import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";

// Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import GroupsListScreen from "../screens/GroupsListScreen";
import UserListScreen from "../screens/UserListScreen";

// Auth Services
import { initCometChat, checkAuthStatus } from "../services/authService";

// Theme
import { COLORS } from "../theme/colors";

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.PRIMARY,
        elevation: 0, // Remove shadow on Android
        shadowOpacity: 0, // Remove shadow on iOS
      },
      headerTintColor: COLORS.TEXT_LIGHT,
      headerTitleStyle: {
        fontWeight: "bold",
      },
      cardStyle: { backgroundColor: COLORS.BACKGROUND },
    }}
  >
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.PRIMARY,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.TEXT_LIGHT,
      headerTitleStyle: {
        fontWeight: "bold",
      },
      cardStyle: { backgroundColor: COLORS.BACKGROUND },
    }}
  >
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen
      name="UsersList"
      component={UserListScreen}
      options={{ title: "Users" }}
    />
    <Stack.Screen
      name="GroupsList"
      component={GroupsListScreen}
      options={{ title: "Groups" }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Initialize CometChat
        const initSuccess = await initCometChat();
        if (!initSuccess) {
          setInitError("Failed to initialize chat service");
          setIsLoading(false);
          return;
        }

        // Check if user is already logged in
        const user = await checkAuthStatus();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.log("App initialization error:", error);
        setInitError("An error occurred during initialization");
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loaderText}>Initializing...</Text>
      </View>
    );
  }

  if (initError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{initError}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BACKGROUND,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.BACKGROUND,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
  },
});

export default AppNavigator;
