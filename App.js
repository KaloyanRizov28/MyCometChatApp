import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, LogBox } from 'react-native';
import AppNavigator from './src/navigation/AppNavigation';
// Ignore specific LogBox warnings
LogBox.ignoreLogs([
  'Warning: ...',  // Add specific warnings you want to ignore
  'Setting a timer', // Common warning with React Native
]);

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;