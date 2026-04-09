import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import GradientBackground from '../../styles/Background';
import Header from './components/Header';
import Logo from '../../styles/Logo';
import Preview from './components/Preview';
import Signup from '../auth/Signup';
import { deleteAccount, getCurrentUser, signOut } from '../../localstorage-services/auth';
import { getFinanceProfile } from '../../localstorage-services/finances';

type UserData = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
};

const ProfilePage = ({ navigation }: { navigation: any }) => {
  const [period, setPeriod] = useState<'preview' | 'edit'>('preview');
  const [user, setUser] = useState<UserData | null>(null);
  const [financeProfile, setFinanceProfile] = useState<any | null>(null);
  useEffect(() => {
    getCurrentUser().then((data) => {
      if (data) setUser(data);
      // console.log(data);
    });
    getFinanceProfile().then((data) => {
      setFinanceProfile(data);
      console.log(data);
    });
  }, []);

  const handleLogout = () => {
    signOut();
    navigation.navigate('Authentication');
  };

  const handleDeleteAccount = () => {
    deleteAccount(user?.email ?? '').then((result) => {
      if (result.success) {
        signOut();
        navigation.navigate('Authentication');
      }
    });
  };

  return (
    <GradientBackground>
      <Header title="PayU" />
      <View style={{ flex: 1, paddingVertical: 24 }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 24 }}>
          <Logo width={32} height={32} borderRadius={10} />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FAFAFA', top: -6 }}>
            {user?.fullName ?? 'Loading...'}
          </Text>
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
        {period === 'preview' ? (
          <Preview email={user?.email ?? ''} financeProfile={financeProfile} />
        ) : (
          <View style={{ flex: 1, top: -24 }}>
            <Signup buttonText="Update Profile" />
          </View>
        )}
      </View>
      <TouchableOpacity style={{ width: '100%', height: 36, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF6B6B', position: 'absolute', bottom: 82, borderRadius: 100, alignSelf: 'center' }}
        onPress={() => {
          handleLogout();
        }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ width: '100%', height: 36, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', position: 'absolute', bottom: 24, borderRadius: 100, alignSelf: 'center' }}
        onPress={() => {
          handleDeleteAccount();
        }}>
        <Text style={{ color: '#FF6B6B', fontSize: 16, fontWeight: 'bold' }}>Delete Account</Text>
      </TouchableOpacity>
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