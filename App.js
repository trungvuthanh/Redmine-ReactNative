// import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useReducer } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from './app/screens/LoginScreen';
import DrawerContent from './app/screens/DrawerContent';
import HomeScreen from './app/screens/HomeScreen';
import OverdueScreen from './app/screens/OverdueScreen';
import ExpToDoScreen from './app/screens/ExpToDoScreen';
import IssueScreen from './app/screens/IssueScreen';
import MyIssueScreen from './app/screens/MyIssueScreen';
import OpenProjectScreen from './app/screens/OpenProjectScreen';
import AddScreen from './app/screens/AddScreen';
import DetailScreen from './app/screens/DetailScreen';

import { AuthContext } from "./app/components/Context";

const Drawer = createDrawerNavigator();
const HomeStack = createStackNavigator();
const IssueStack = createStackNavigator();
const MyIssueStack = createStackNavigator();
const OpenProjectStack = createStackNavigator();

const DrawerScreen = () => (
  <Drawer.Navigator
    initialRouteName="Dashboard"
    drawerContent={props => <DrawerContent {...props} />}
  >
    <Drawer.Screen name="Dashboard" component={HomeStackScreen} options={{headerShown: false}}/>
    <Drawer.Screen name="OpenProjectStack" component={OpenProjectStackScreen} options={{headerShown: false}}/>
    <Drawer.Screen name="IssueStack" component={IssueStackScreen} options={{headerShown: false}}/>
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
      name="IssueStack"
      component={IssueStackScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="MyIssueStack"
      component={MyIssueStackScreen}
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

const IssueStackScreen = () => (
  <IssueStack.Navigator initialRouteName='Issue'>
    <IssueStack.Screen
      name="Issue"
      component={IssueScreen}
      options={{
        headerShown: false,
      }}
    />
    <IssueStack.Screen
      name="DetailScreen"
      component={DetailScreen}
      options={{
        headerShown: false,
      }}
    />
    <IssueStack.Screen
      name="AddScreen"
      component={AddScreen}
      options={{
        headerShown: false,
      }}
    />
  </IssueStack.Navigator>
)

const MyIssueStackScreen = () => (
  <MyIssueStack.Navigator initialRouteName='MyIssue'>
    <MyIssueStack.Screen
      name="MyIssue"
      component={MyIssueScreen}
      options={{
        headerShown: false,
      }}
    />
    <MyIssueStack.Screen
      name="DetailScreen"
      component={DetailScreen}
      options={{
        headerShown: false,
      }}
    />
    <MyIssueStack.Screen
      name="AddScreen"
      component={AddScreen}
      options={{
        headerShown: false,
      }}
    />
  </MyIssueStack.Navigator>
)

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

  const initialLoginState = {
    isLoading: true,
    username: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          username: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          username: null,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(
    () => ({
      signIn: async (username, password) => {
        let userToken;
        userToken = null;
        fetch("http://", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        })
          .then((response) => response.json())
          .then(async (json) => {
            if (json[0]._id == -1) {
              alert("Username or Password is incorrect");
            } else {
              // signIn(json[0]._id);
              try {
                userToken = "abc";
                await AsyncStorage.setItem("userToken", userToken);
              } catch (e) {
                console.error(e);
              }
              dispatch({ type: "LOGIN", id: username, token: userToken });
              console.log("Signed in successfully");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("userToken");
        } catch (e) {
          console.error(e);
        }
        dispatch({ type: "LOGOUT" });
      },
    }),
    []
  );

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