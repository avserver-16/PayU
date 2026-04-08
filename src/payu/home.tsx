import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import GradientBackground from '../../styles/Background';
import Header from './components/Header';
import BankCard from './components/BankCard';
import ExpenseCard from './components/ExpenseCard';
import { getCurrentUser } from '../../localstorage-services/auth';
type UserData = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
};
const HomePage = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    getCurrentUser().then((data) => {
      if (data) setUser(data);
      // console.log(data);
    });
  }, []);
  return (
    <GradientBackground>
      <Header title="PayU" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Hey, {user?.fullName || 'User'}</Text>
          <Text style={styles.greetingSubtitle}>Add your yesterday's expense</Text>
        </View>

        {/* Bank Card */}
        <View style={styles.cardContainer}>
          <BankCard holderName={user?.fullName || 'User'} />
        </View>

        {/* Expenses Section */}
        <View>
          <Text style={styles.sectionTitle}>Your Expenses</Text>

          {/* Weekly / Monthly Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, period === 'weekly' && styles.activeToggle]}
              onPress={() => setPeriod('weekly')}
            >
              <Text style={[styles.toggleText, period === 'weekly' && styles.activeToggleText]}>
                Weekly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleButton, period === 'monthly' && styles.activeToggle]}
              onPress={() => setPeriod('monthly')}
            >
              <Text style={[styles.toggleText, period === 'monthly' && styles.activeToggleText]}>
                Monthly
              </Text>
            </TouchableOpacity>
          </View>

          {/* Expense Cards */}
          <View style={styles.expenseList}>
            {period === 'weekly' ? (
              <>
                <ExpenseCard title="FOOD" description="Lesser than last week" price="$1000" />
                <ExpenseCard title="TRAVEL" description="More than last week" price="$1000" />
                <ExpenseCard title="BILLS" description="Bills paid" price="$2000" />
                <ExpenseCard title="RENT" description="Rent paid" price="$1109" />

              </>
            ) : (
              <>
                <ExpenseCard title="SHOPPING" description="Lesser than last month" price="$220" />
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 24,
    // paddingHorizontal: 16,
  },
  greetingContainer: {
    gap: 8,
    marginBottom: 12,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FAFAFA',
  },
  greetingSubtitle: {
    fontSize: 16,
    color: '#A1A1A1',
  },
  cardContainer: {
    marginBottom: 48,
    paddingHorizontal: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FAFAFA',
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#262626',
    borderRadius: 100,
    padding: 8,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 4,
    alignItems: 'center',
    borderRadius: 100,
  },
  activeToggle: {
    backgroundColor: '#FAFAFA',
  },
  toggleText: {
    color: '#A1A1A1',
    fontSize: 14,
  },
  activeToggleText: {
    color: '#000',
  },
  expenseList: {
    gap: 12,
  },
});

export default HomePage;