// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './app/screens/HomeScreen';
import MilestoneScreen from './app/screens/MilestoneScreen';
import OverdueScreen from './app/screens/OverdueScreen';
import ExpToDoScreen from './app/screens/ExpToDoScreen';
import AssignmentScreen from './app/screens/AssignmentScreen';
import MyToDoScreen from './app/screens/MyToDoScreen';
import OpenProjectScreen from './app/screens/OpenProjectScreen';

const Drawer = createDrawerNavigator();
const HomeStack = createStackNavigator();

const DrawerScreen = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={HomeStackScreen} />
  </Drawer.Navigator>
);

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="Milestone"
      component={MilestoneScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="Overdue"
      component={OverdueScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="Expired"
      component={ExpToDoScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="Assignment"
      component={AssignmentScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="MyToDo"
      component={MyToDoScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="OpenProject"
      component={OpenProjectScreen}
      options={{
        headerShown: false,
      }}
    />
  </HomeStack.Navigator>
);

export default function App() {
  return (
    <>
      <StatusBar
        backgroundColor={"#fff"}
        barStyle={"dark-content"}
        hidden={false}
      />
      <NavigationContainer>
        <DrawerScreen/>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})