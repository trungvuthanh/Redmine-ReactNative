import React, { useReducer } from 'react';
import {
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from "@react-native-async-storage/async-storage";

import users from './app/config/configurations';

import LoginScreen from './app/screens/LoginScreen';
import DrawerContent from './app/screens/DrawerContent';
import HomeScreen from './app/screens/HomeScreen';
import ClosedScreen from './app/screens/ClosedScreen';
import ExpToDoScreen from './app/screens/ExpToDoScreen';
import IssueScreen from './app/screens/IssueScreen';
import MyIssueScreen from './app/screens/MyIssueScreen';
import ProjectScreen from './app/screens/ProjectScreen';
import AddScreen from './app/screens/AddScreen';
import DetailScreen from './app/screens/DetailScreen';
import EditIssueScreen from './app/screens/EditIssueScreen';
import EditProjectScreen from './app/screens/EditProjectScreen';

import { AuthContext } from "./app/components/Context";

const Drawer = createDrawerNavigator();
const HomeStack = createStackNavigator();
const ClosedStack = createStackNavigator();
const IssueStack = createStackNavigator();
const MyIssueStack = createStackNavigator();
const ProjectStack = createStackNavigator();

const DrawerScreen = ({ fullname }) => (
  <Drawer.Navigator
    initialRouteName="Dashboard"
    drawerContent={props => <DrawerContent {...props} {...fullname} />}
  >
    <Drawer.Screen
      name="Dashboard"
      component={HomeStackScreen}
      options={{headerShown: false}}/>
    <Drawer.Screen
      name="ProjectStack"
      component={ProjectStackScreen}
      options={{headerShown: false}}/>
    <Drawer.Screen
      name="IssueStack"
      component={IssueStackScreen}
      options={{headerShown: false}}/>
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
      name="ClosedStack"
      component={ClosedStackScreen}
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
      name="ProjectStack"
      component={ProjectStackScreen}
      options={{
        headerShown: false,
      }}
    />
  </HomeStack.Navigator>
);

const ClosedStackScreen = () => (
  <ClosedStack.Navigator initialRouteName='ClosedScreen'>
    <ClosedStack.Screen
      name="ClosedScreen"
      component={ClosedScreen}
      options={{
        headerShown: false,
      }}
    />
    <ClosedStack.Screen
      name="DetailScreen"
      component={DetailScreen}
      options={{
        headerShown: false,
      }}
    />
    <ClosedStack.Screen
      name="AddScreen"
      component={AddScreen}
      options={{
        headerShown: false,
      }}
    />
    <ClosedStack.Screen
      name="EditIssueScreen"
      component={EditIssueScreen}
      options={{
        headerShown: false,
      }}
    />
  </ClosedStack.Navigator>
)

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
    <IssueStack.Screen
      name="EditIssueScreen"
      component={EditIssueScreen}
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
    <MyIssueStack.Screen
      name="EditIssueScreen"
      component={EditIssueScreen}
      options={{
        headerShown: false,
      }}
    />
  </MyIssueStack.Navigator>
)

const ProjectStackScreen = () => (
  <ProjectStack.Navigator initialRouteName="Project">
    <ProjectStack.Screen
      name="Project"
      component={ProjectScreen}
      options={{
        headerShown: false,
      }}
    />
    <ProjectStack.Screen
      name="AddScreen"
      component={AddScreen}
      options={{
        headerShown: false,
      }}
    />
    <ProjectStack.Screen
      name="DetailScreen"
      component={DetailScreen}
      options={{
        headerShown: false,
      }}
    />
    <ProjectStack.Screen
      name="EditIssueScreen"
      component={EditIssueScreen}
      options={{
        headerShown: false,
      }}
    />
    <ProjectStack.Screen
      name="EditProjectScreen"
      component={EditProjectScreen}
      options={{
        headerShown: false,
      }}
    />
  </ProjectStack.Navigator>
);

export default function App() {

  const authenticate = (username, password) => {
    for (let user of users) {
      if (user.username === username && user.password === password) {
        return user;
      }
    }
    return null;
  }

  const initialLoginState = {
    isLoading: true,
    username: null,
    fullname: null,
    apiKey: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          apiKey: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          username: action.id,
          fullname: action.fullname,
          apiKey: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          username: null,
          fullname: null,
          apiKey: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(
    () => ({
      signIn: async (username, password) => {
        let user = authenticate(username, password);
        if (user) {
          let apiKey = user.api_key;
          try {
            await AsyncStorage.setItem("user", JSON.stringify(user));
          } catch (e) {
            console.error(e);
          }
          dispatch({
            type: "LOGIN",
            id: username,
            fullname: user.firstname + ' ' + user.lastname,
            token: apiKey
          });
          console.log("Signed in successfully");
        } else {
          Alert.alert(
            "username or password is incorrect",
            "",
          );
        }
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("apiKey");
        } catch (e) {
          console.error(e);
        }
        dispatch({ type: "LOGOUT" });
        console.log("Signed out successfully");
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
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {loginState.apiKey ? <DrawerScreen fullname={{fullname: loginState.fullname}} /> : <LoginScreen/>}
        </NavigationContainer>
      </AuthContext.Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
