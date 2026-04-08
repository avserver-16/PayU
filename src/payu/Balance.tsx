import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import GradientBackground from '../../styles/Background';
import Header from './components/Header';
import SemiCircle from './components/Semicircle';
import ExpenseCard from './components/ExpenseCard';
import TimelineBarChart from './components/GradientBarGraph';
import SemiCirclePieChart from './components/Semicircle';

const BalancePage = () => {
  return (
    <GradientBackground>
      <Header title="PayU" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingVertical: 0, gap: 8 }}>
          <Text style={{ color: '#FAFAFA', fontSize: 20, fontWeight: 'bold' }}>Your Balanace</Text>
          <Text style={{ color: '#A1A1A1', fontSize: 16, fontWeight: 'regular' }}>Manage your multi-currency accounts</Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <SemiCirclePieChart
            title="Your Credit score is average"
            subtitle="Last check on 21 April"
            size={300}
            strokeWidth={24}
            gapDeg={5}
            valueText={660}
            data={[
              { label: "Good", value: 600, color: "#3FB9A2"},
              { label: "Better", value: 200, color: "#EE89DF", colorEnd: "#EE89DF" },
              { label: "Best", value: 150, color: "#74B8EF" },
              { label: "Marvelous", value: 50, color: "#F6D2B3" },
            ]}
          />
        </View>
        <View style={{ marginTop: 24, gap: 18 }}>
          <Text style={{ color: '#FAFAFA', fontSize: 16, fontWeight: 'semibold', marginBottom: 12 }}>Available Currencies</Text>
          <ExpenseCard title="USD" description="United States Dollar" price="+ Enable" colors={["#262626", "#0A0A0A"]} />
          {/* <ExpenseCard title="CAD" description="Canadian Dollar" price="+ Enable" colors={["#262626", "#0A0A0A"]} /> */}
          {/* <ExpenseCard title="EUR" description="Euro" price="+ Enable" colors={["#262626", "#0A0A0A"]} /> */}
        </View>
        <View style={{ marginTop: 24 }}>
          <TimelineBarChart />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 48 }}>
            <Text style={{ color: '#7A7A7A', fontSize: 12, fontWeight: 'semibold' }}>Current Margin: April Spendings</Text>
            <Text style={{ color: '#3B2C6E', fontSize: 12, fontWeight: 'regular' }}>$35.00 / $20.00</Text>
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
});

export default BalancePage;
