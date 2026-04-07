import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Home } from 'lucide-react-native';
import GradientBackground from '../../styles/Background';
import Header from './components/Header';
import BankCard from './components/BankCard';
import ExpenseCard from './components/ExpenseCard';

const HomePage = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  return (
    <GradientBackground>
      <Header title="PayU" />

      <ScrollView
        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 8, marginBottom: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#FAFAFA" }}>
            Hey, Alex
          </Text>
          <Text style={{ fontSize: 16, color: "#A1A1A1" }}>
            Add your yesterday’s expense
          </Text>
        </View>

        <View style={{ marginBottom: 48 }}>
          <BankCard />
        </View>

        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: "#FAFAFA", marginBottom: 12 }}>
            Your Expenses
          </Text>

          <View style={styles.toggleContainer}> <TouchableOpacity style={[styles.toggleButton, period === 'weekly' && styles.activeToggle,]} onPress={() => setPeriod('weekly')} > <Text style={[styles.toggleText, period === 'weekly' && styles.activeToggleText,]} > Weekly </Text> </TouchableOpacity> <TouchableOpacity style={[styles.toggleButton, period === 'monthly' && styles.activeToggle,]} onPress={() => setPeriod('monthly')} > <Text style={[styles.toggleText, period === 'monthly' && styles.activeToggleText,]} > Monthly </Text> </TouchableOpacity>
          </View>
          {/* Expense Cards */}
          <View style={{ gap: 12 }}>
            <ExpenseCard title="FOOD" description="Lesser than last week" price="$1000" />
            <ExpenseCard title="TRAVEL" description="More than last week" price="$1000" />
            
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
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
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#262626",
    borderRadius: 100,
    padding: 8,
    justifyContent: "space-between",
    marginBottom: 24
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 4,
    alignItems: "center",
    borderRadius: 100,
  },

  activeToggle: {
    backgroundColor: "#FAFAFA",
  },

  toggleText: {
    color: "#A1A1A1",
    fontSize: 14,
    // fontWeight: "500",
  },

  activeToggleText: {
    color: "#000",
    // fontWeight: "600",
  },
});

export default HomePage;
