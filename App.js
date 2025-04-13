import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, LogBox } from 'react-native';
import AppNavigation from './src/navigation/AppNavigation';

// Ignore specific LogBox warnings
LogBox.ignoreLogs([
  'Warning: ...',  // Add specific warnings you want to ignore
  'Setting a timer', // Common warning with React Native
  'VirtualizedLists should never be nested', // For nested FlatLists
]);

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;