import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Home } from 'lucide-react-native';

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Home size={48} color="#007AFF" style={styles.icon} />
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Welcome to PayU</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomePage;
