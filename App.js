// import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useReducer } from 'react';
import {
  StyleSheet,
  StatusBar,
  Alert,
  View,
  ActivityIndicator,
} from 'react-native';
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
import EditIssueScreen from './app/screens/EditIssueScreen';
import EditProjectScreen from './app/screens/EditProjectScreen';

import { AuthContext } from "./app/components/Context";

const Drawer = createDrawerNavigator();
const HomeStack = createStackNavigator();
const OverdueStack = createStackNavigator();
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
      name="OverdueStack"
      component={OverdueStackScreen}
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

const OverdueStackScreen = () => (
  <OverdueStack.Navigator initialRouteName='OverdueScreen'>
    <OverdueStack.Screen
      name="OverdueScreen"
      component={OverdueScreen}
      options={{
        headerShown: false,
      }}
    />
    <OverdueStack.Screen
      name="DetailScreen"
      component={DetailScreen}
      options={{
        headerShown: false,
      }}
    />
    <OverdueStack.Screen
      name="AddScreen"
      component={AddScreen}
      options={{
        headerShown: false,
      }}
    />
    <OverdueStack.Screen
      name="EditIssueScreen"
      component={EditIssueScreen}
      options={{
        headerShown: false,
      }}
    />
  </OverdueStack.Navigator>
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
    <OpenProjectStack.Screen
      name="EditIssueScreen"
      component={EditIssueScreen}
      options={{
        headerShown: false,
      }}
    />
    <OpenProjectStack.Screen
      name="EditProjectScreen"
      component={EditProjectScreen}
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
          apiKey: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          username: null,
          apiKey: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(
    () => ({
      signIn: async (username, password) => {
        let apiKey;
        apiKey = null;
        fetch('http://' + username + ':' + password + '@192.168.1.50:80/redmine/users/current.json', {
          headers: {
            'X-Redmine-API-Key': '34dafb931f5817ecf25be180ceaf87029142915e',
          },
        })
        .then((response) => {
          if (response.status == 401) {
            Alert.alert(
              "username or password is incorrect",
              "",
            );
          } else {
            response.json()
            .then(async (json) => {
              try {
                apiKey = json.user.api_key;
                await AsyncStorage.setItem("apiKey", apiKey);
              } catch (e) {
                console.error(e);
              }
              dispatch({ type: "LOGIN", id: username, token: apiKey });
              console.log("Signed in successfully");
            })
            .catch((error) => {
              console.error(error);
            });
          }
        })
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("apiKey");
        } catch (e) {
          console.error(e);
        }
        dispatch({ type: "LOGOUT" });
      },
    }),
    []
  );

  // if(loginState.isLoading) {
  //   return(
  //     <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
  //       <ActivityIndicator size="large"/>
  //     </View>
  //   );
  // }
  return (
    <>
      <StatusBar
        backgroundColor={"#fff"}
        barStyle={"dark-content"}
        hidden={false}
      />
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {loginState.apiKey ? <DrawerScreen/> : <LoginScreen/>}
          {/* <DrawerScreen/> */}
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