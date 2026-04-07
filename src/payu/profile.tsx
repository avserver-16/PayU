import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import GradientBackground from '../../styles/Background';
import Header from './components/Header';
import Logo from '../../styles/Logo';
import Preview from './components/Preview';
import Signup from '../auth/Signup';

const ProfilePage = () => {
  const [period, setPeriod] = useState<'preview' | 'edit'>('preview');

  return (
    <GradientBackground>
      <Header title="PayU" />
      <View style={{ flex: 1, paddingVertical: 24 }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 24 }}>
          <Logo width={32} height={32} borderRadius={10} />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FAFAFA', top: -6 }}>Alex Lyu</Text>
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, period === 'preview' && styles.activeToggle]}
            onPress={() => setPeriod('preview')}
          >
            <Text style={[styles.toggleText, period === 'preview' && styles.activeToggleText]}>
              Preview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, period === 'edit' && styles.activeToggle]}
            onPress={() => setPeriod('edit')}
          >
            <Text style={[styles.toggleText, period === 'edit' && styles.activeToggleText]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        {
          period === 'preview' ? <Preview /> : <View style={{ flex: 1 ,top:-24}}><Signup buttonText="Update Profile" /></View>
        }
      </View>
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
    flexDirection: 'row',
    backgroundColor: '#262626',
    borderRadius: 100,
    padding: 8,
    justifyContent: 'space-between',
    // marginBottom: 24,
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
});

export default ProfilePage;
