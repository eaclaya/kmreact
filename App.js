import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {LoginStackScreen} from './navigation/StackNavigator';
import DrawerNavigator from "./navigation/DrawerNavigation";
import { ActivityIndicator, View, Alert } from 'react-native';
import { useEffect } from 'react';
import { AuthContext } from './components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthUser} from './network';
import * as Network from 'expo-network';


export default function App() {
  const initialLoginState = {
    isLoading: true,
    email: null,
    user: null
  }
  
  const loginReducer = (prevState, action) => {
    switch(action.type){
      case 'LOGIN': 
        return {
          ...prevState,
          email: action.id,
          user: action.user,
          isLoading: false
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          email: null,
          user: null,
          isLoading: false
        };
      case 'RETRIEVE_USER': 
        return {
          ...prevState,
          user: action.user,
          isLoading: false
        };
    }
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    login: async(email, password) => {
      let user = null;
      let response = await AuthUser(email, password);
      if(response && response.success){
        user = response.user;
        try {
          await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
          console.log(e);
        }
      }else{
        console.log('Credenciales incorrectas');
        Alert.alert('Credenciales incorrectas', 'Intenta de nuevo por favor');
      }
      dispatch({type: 'LOGIN', id: email, user: user});
    },
    logout: async() => {
      try {
        await AsyncStorage.removeItem('user');
      } catch (e) {
        console.log(e);
      }
      dispatch({type: 'LOGOUT'});
    },
  }));

  useEffect(() => {
    setTimeout(async() => {
      let user = null;
      try {
        user = await AsyncStorage.getItem('user');
      } catch (e) {
        console.log(e);
      }
      dispatch({type: 'RETRIEVE_USER', user: user});
    }, 500);
  }, []);

  if(loginState.isLoading){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large"></ActivityIndicator>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
    <NavigationContainer>
      {loginState.user !== null ? (
         <DrawerNavigator />
      ) : <LoginStackScreen /> }
      
    </NavigationContainer>
    </AuthContext.Provider>
  );
}