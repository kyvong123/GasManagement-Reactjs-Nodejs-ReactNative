import  AsyncStorage  from '@react-native-community/async-storage';
const AUTH_TOKEN = 'auth_token'

export const TOKEN =  ''

const setAuthToken = async (token) => {
   await AsyncStorage.setItem(AUTH_TOKEN, JSON.stringify(token))
}

const resetAuthToken = async () => {
  //await AsyncStorage.removeItem(AUTH_TOKEN)
  await AsyncStorage.clear();
}

const getAuthToken = async () => {
  const val = await AsyncStorage.getItem(AUTH_TOKEN)
  return JSON.parse(val)
}

export default { setAuthToken, getAuthToken, resetAuthToken }
