import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginScreen from '../screens/LoginScreen';
import InvoiceScreen from '../screens/InvoiceScreen';
import ClientScreen from '../screens/ClientScreen';
import ProductScreen from '../screens/ProductScreen';
import ClientFormScreen from '../screens/ClientFormScreen';

const Stack = createStackNavigator();

const InvoiceStackScreen = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen name="Invoice" component={InvoiceScreen} options={{ title: 'Facturas', headerLeft: () =>  (<MaterialCommunityIcons name="menu"  size={26} onPress={() => navigation.openDrawer()} />) }} />
  </Stack.Navigator>
)

const ClientStackScreen = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen name="Client" component={ClientScreen} options={{ title: 'Clientes', headerLeft: () =>  (<MaterialCommunityIcons name="menu"  size={26} onPress={() => navigation.openDrawer()} />) }} screenOptions={{
        headerStyle: { elevation: 0 },
        cardStyle: { backgroundColor: '#fff' }
    }} />
    <Stack.Screen name="ClientForm" component={ClientFormScreen} options={{ title: 'Cliente' }} screenOptions={{
        headerStyle: { elevation: 0 },
        cardStyle: { backgroundColor: '#fff' }
    }} />
  </Stack.Navigator>
)

const ProductStackScreen = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen name="Product" component={ProductScreen} options={{ title: 'Productos', headerLeft: () =>  (<MaterialCommunityIcons name="menu"  size={26} onPress={() => navigation.openDrawer()} />) }} />
  </Stack.Navigator>
)

const LoginStackScreen = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
)

export {InvoiceStackScreen, ClientStackScreen, ProductStackScreen, LoginStackScreen}





 



