import React, { useState } from 'react';
import { 
  View, 
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  Keyboard,
  ScrollView,
} from 'react-native';

import myFont from '../config/myFont';

export default function LoginScreen({ navigation }) {
  const [username, onChangeUsername] = useState('');
  const [password, onChangePassword] = useState('');
  const [isObscure, setIsObscure] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={styles.loginScreenContainer}
        >
          <View style={styles.headingLogo}>
            <Image style={styles.logo} source={require('../../assets/logo.png')} />
          </View>
          <View style={styles.loginBox}>
            <Text style={{fontSize: 30, fontWeight: '300'}}>Sign in Redmine</Text>
            <View style={{marginTop: 30}}>
              <TextInput
                style={[styles.inputText, {marginBottom: 5}]}
                placeholder='Login name'
                onChangeText={(username) => onChangeUsername(username)}
                value={username}
              />
              <TextInput
                style={styles.inputText}
                placeholder='password'
                secureTextEntry={isObscure}
                onChangeText={(password) => onChangePassword(password)}
                value={password}
              />
              <Pressable
                onPress={() => {}}
                style={({pressed}) => [
                  {
                    backgroundColor: pressed
                      ? myFont.buttonPressedColor
                      : myFont.addButtonColor,
                  },
                  styles.loginButton
                ]}
              >
                <Text style={{color: '#fff', fontSize: 16}}>Login</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>  
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginScreenContainer: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headingLogo: {
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain'
  },
  loginBox: {
    maxWidth: 450,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center'
  },
  inputText: {
    width: 300,
    height: 50,
    paddingVertical: 12,
    paddingLeft: 10,
    paddingRight: 12,
    fontSize: 13,
    fontWeight: '300',
    backgroundColor: '#ecedee',
    borderRadius: 3,
  },
  loginButton: {
    marginVertical: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
})