import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DollarSign } from 'lucide-react-native';

const BalancePage = () => {
  return (
    <View style={styles.container}>
      <DollarSign size={48} color="#007AFF" style={styles.icon} />
      <Text style={styles.title}>Balance</Text>
      <Text style={styles.balanceAmount}>$1,234.56</Text>
      <Text style={styles.subtitle}>Available Balance</Text>
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
    marginBottom: 20,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default BalancePage;
