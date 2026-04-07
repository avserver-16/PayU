import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, DollarSign, User } from 'lucide-react-native';
import HomePage from './home';
import BalancePage from './Balance';
import ProfilePage from './profile';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      if (route.name === 'Home') {
        return <Home size={size} color={color} />;
      } else if (route.name === 'Balance') {
        return <DollarSign size={size} color={color} />;
      } else if (route.name === 'Profile') {
        return <User size={size} color={color} />;
      }
    },

   
    tabBarActiveTintColor: '#FAFAFA',
    tabBarInactiveTintColor: 'gray',

  
    tabBarStyle: {
      backgroundColor: '#0A0A0A',
      borderTopWidth: 0.3,
      borderColor: '#000000',
      height: 70,
      paddingBottom: 10,
      paddingTop: 6,
    },

    headerShown: false,
  })}
>
      <Tab.Screen 
        name="Home" 
        component={HomePage}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Balance" 
        component={BalancePage}
        options={{
          tabBarLabel: 'Balance',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfilePage}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
