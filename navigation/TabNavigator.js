import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {InvoiceStackScreen, ProductStackScreen, ClientStackScreen, LoginStackScreen} from './StackNavigator';

const Tab = createMaterialBottomTabNavigator();



const BottomTabNavigator = () => (
  <Tab.Navigator
      initialRouteName="Invoice"
      barStyle={{ backgroundColor: '#008080' }}
    >
     <Tab.Screen 
                name="Invoice" 
                component={InvoiceStackScreen} 
                options={{ title: 'Facturas', tabBarIcon: ({ color }) => (
                          <MaterialCommunityIcons name="file-document" color={color} size={26} />
                ), }}  
      />
      <Tab.Screen name="Client" component={ClientStackScreen} 
                        options={{ title: 'Clientes', tabBarIcon: ({ color }) => (
                          <MaterialCommunityIcons name="account" color={color} size={26} />
                ), }}   
      />
      <Tab.Screen name="Product" component={ProductStackScreen} 
                        options={{ title: 'Productos', tabBarIcon: ({ color }) => (
                          <MaterialCommunityIcons name="archive" color={color} size={26} />
                ), }} 
      /> 
      </Tab.Navigator>
);

export default BottomTabNavigator;