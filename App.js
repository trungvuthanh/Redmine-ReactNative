// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerContent from './app/screens/DrawerContent';
import HomeScreen from './app/screens/HomeScreen';
import MilestoneScreen from './app/screens/MilestoneScreen';
import OverdueScreen from './app/screens/OverdueScreen';
import ExpToDoScreen from './app/screens/ExpToDoScreen';
import AssignmentScreen from './app/screens/AssignmentScreen';
import MyToDoScreen from './app/screens/MyToDoScreen';
import OpenProjectScreen from './app/screens/OpenProjectScreen';
import AddScreen from './app/screens/AddScreen';
import DetailScreen from './app/screens/DetailScreen';

const Drawer = createDrawerNavigator();
const HomeStack = createStackNavigator();
const OpenProjectStack = createStackNavigator();

const DrawerScreen = () => (
  <Drawer.Navigator
    initialRouteName="Dashboard"
    drawerContent={props => <DrawerContent {...props} />}
  >
    <Drawer.Screen name="Dashboard" component={HomeStackScreen} options={{headerShown: false}}/>
    <Drawer.Screen name="OpenProjectStack" component={OpenProjectStackScreen} options={{headerShown: false}}/>
  </Drawer.Navigator>
);

const HomeStackScreen = () => (
  <HomeStack.Navigator initialRouteName="Home">
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
      name="OpenProjectStack"
      component={OpenProjectStackScreen}
      options={{
        headerShown: false,
      }}
    />
  </HomeStack.Navigator>
);

const OpenProjectStackScreen = () => (
  <OpenProjectStack.Navigator initialRouteName="OpenProject">
    <OpenProjectStack.Screen
      name="OpenProject"
      component={OpenProjectScreen}
      options={{
        headerShown: false,
      }}
    />
    <OpenProjectStack.Screen
      name="AddScreen"
      component={AddScreen}
      options={{
        headerShown: false,
      }}
    />
    <OpenProjectStack.Screen
      name="DetailScreen"
      component={DetailScreen}
      options={{
        headerShown: false,
      }}
    />
  </OpenProjectStack.Navigator>
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