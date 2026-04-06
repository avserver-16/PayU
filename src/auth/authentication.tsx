import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import GradientBackground from '../../styles/Background';
import Logo from '../../styles/Logo';
import Signin from './Signin';
import Signup from './Signup';

const { height } = Dimensions.get('window');

const Authentication = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Top Section */}
        <View style={styles.contentContainer}>
          <Logo width={64} height={64} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to PayU</Text>
            <Text style={styles.subtitle}>
              Send money globally with the real exchange rate
            </Text>
          </View>
        </View>

        {/* Auth Card */}
        <View style={styles.authContainer}>
          <Text style={styles.authText}>
            Get Started
          </Text>

          <Text style={styles.authSubtext}>
            Sign in to your account or create a new one
          </Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === 'signin' && styles.activeToggle,
              ]}
              onPress={() => setMode('signin')}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === 'signin' && styles.activeToggleText,
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === 'signup' && styles.activeToggle,
              ]}
              onPress={() => setMode('signup')}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === 'signup' && styles.activeToggleText,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
          {/* Conditional Rendering */}
          {mode === 'signin' ? <Signin /> : <Signup />}



        </View>

      </ScrollView>
    </GradientBackground>
  );
};

export default Authentication;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    gap: 24,
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: height * 0.05, // responsive spacing
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FAFAFA',
  },
  subtitle: {
    fontSize: 14,
    color: '#A1A1A1',
    textAlign: 'center',
  },
  authContainer: {
    backgroundColor: '#171717',
    width: '100%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#262626',
    gap: 12,
  },
  authText: {
    color: '#FAFAFA',
    fontSize: 24,
    fontWeight: '600',
  },
  authSubtext: {
    color: '#A1A1A1',
    fontSize: 16,
  },
  switchText: {
    color: '#9AB17A',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
  // toggleContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   gap: 12,
  //   width: '100%',
  //   backgroundColor: '#262626',
  //   padding: 8,
  //   borderRadius: 8,
  // },
  // toggleButton: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   // padding: 8,
  //   borderRadius: 8,
  //   flexDirection: 'row',
  //   paddingHorizontal: 24,
  // },
  // toggleButtonText: {
  //   color: '#FAFAFA',
  //   fontSize: 16,
  //   fontWeight: '600',
  //   alignSelf: 'center',
  // },
  toggleContainer: {
  flexDirection: 'row',
  backgroundColor: '#262626',
  borderRadius: 100,
  padding: 4,
},

toggleButton: {
  flex: 1,
  paddingVertical: 6,
  alignItems: 'center',
  borderRadius: 100,
},

activeToggle: {
  backgroundColor: '#FAFAFA',
},

toggleText: {
  color: '#A1A1A1',
  fontSize: 14,
  fontWeight: '500',
},

activeToggleText: {
  color: '#000',
  fontWeight: '600',
},
});