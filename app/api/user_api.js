import AsyncStorage from '@react-native-async-storage/async-storage';

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
