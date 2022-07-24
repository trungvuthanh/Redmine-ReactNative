import AsyncStorage from '@react-native-async-storage/async-storage';

/*
Sign in
*/
export const sign_in = async (username, password) => {
  try {
    let response = await fetch('http://' + username + ':' + password + '@192.168.1.50:80/redmine/users/current.json', {
      headers: {
        'Content-Type': 'application/json',
        'X-Redmine-API-Key': '34dafb931f5817ecf25be180ceaf87029142915e', // Admin API-Key
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

/*
Get logged-in user
*/
export const get_user = async () => {
  try {
    let user = await AsyncStorage.getItem('user');
    return JSON.parse(user);
  } catch (error) {
    console.error(error);
  }
}
