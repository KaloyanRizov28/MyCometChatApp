import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";

// Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import UsersListScreen from "../screens/UserListScreen";
import GroupsListScreen from "../screens/GroupsListScreen";
import CalendarScreen from "../screens/CalendarScreen";
import GamesScreen from "../screens/GamesScreen";
import CarrerScreen from "../screens/CarrerScreen";

// Auth Services
import { initCometChat, checkAuthStatus } from "../services/authService";

// Theme
import { COLORS } from "../theme/colors";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Bar Icons
const getTabBarIcon = (route, focused) => {
  let iconText;
  
  if (route.name === "HomeTab") {
    iconText = "🏠";
  } else if (route.name === "CalendarTab") {
    iconText = "📅";
  } else if (route.name === "ChatsTab") {
    iconText = "💬";
  } else if (route.name === "GamesTab") {
    iconText = "🎮";
  } else if (route.name === "CareerTab") {
    iconText = "💼";
  }
  
  return (
    <View style={[
      styles.tabIcon, 
      route.name === "HomeTab" && styles.homeTabIcon,
      focused && (route.name === "HomeTab" ? styles.activeHomeTabIcon : styles.activeTabIcon)
    ]}>
      <Text style={styles.tabIconText}>{iconText}</Text>
    </View>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => getTabBarIcon(route, focused),
        tabBarActiveTintColor: "#614EC1",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
          height: 60,
          paddingBottom: 5,
        },
        tabBarItemStyle: {
          paddingTop: route.name === "HomeTab" ? 0 : 5,
        },
      })}
    >
      <Tab.Screen 
        name="CalendarTab" 
        component={CalendarScreen} 
        options={{ tabBarLabel: "Календар" }}
      />
      <Tab.Screen 
        name="ChatsTab" 
        component={UsersListScreen} 
        options={{ tabBarLabel: "Разговори" }}
      />
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ tabBarLabel: "Начало" }}
      />
      <Tab.Screen 
        name="GamesTab" 
        component={GamesScreen} 
        options={{ tabBarLabel: "Игри" }}
      />
      <Tab.Screen 
        name="CareerTab" 
        component={CarrerScreen} 
        options={{ tabBarLabel: "Кариери" }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: "#ffffff" },
    }}
  >
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
    />
    <Stack.Screen 
      name="Register" 
      component={RegisterScreen}
    />
  </Stack.Navigator>
);

// Main App Stack
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen 
      name="MainTabs" 
      component={MainTabNavigator} 
    />
    <Stack.Screen 
      name="Chat" 
      component={ChatScreen} 
      options={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#614EC1",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
    <Stack.Screen 
      name="UsersListScreen" 
      component={UsersListScreen} 
      options={{
        headerShown: true,
        title: "Потребители",
        headerStyle: {
          backgroundColor: "#614EC1",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
    <Stack.Screen 
      name="GroupsList" 
      component={GroupsListScreen} 
      options={{
        headerShown: true,
        title: "Групи",
        headerStyle: {
          backgroundColor: "#614EC1",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
  </Stack.Navigator>
);

// Main App Navigator
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
          setInitError("Неуспешно инициализиране на чат услугата");
          setIsLoading(false);
          return;
        }
        
        // Check if user is already logged in
        const user = await checkAuthStatus();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.log("App initialization error:", error);
        setInitError("Възникна грешка при инициализирането");
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#614EC1" />
        <Text style={styles.loaderText}>Инициализиране...</Text>
      </View>
    );
  }

  if (initError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Нещо се обърка</Text>
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
    backgroundColor: "#ffffff",
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: "#614EC1",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
  },
  tabIcon: {
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabIcon: {
    backgroundColor: "#f0f0f0",
    borderRadius: 11,
  },
  homeTabIcon: {
    width: 50,
    height: 50,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    marginTop: -15,
  },
  activeHomeTabIcon: {
    backgroundColor: "#614EC1",
  },
  tabIconText: {
    fontSize: 16,
  },
});

export default AppNavigator;