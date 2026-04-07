import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import GradientBackground from '../../styles/Background';
import Header from './components/Header';

const BalancePage = () => {
  return (
   <GradientBackground>
      <Header title="PayU" />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({

});

export default BalancePage;
