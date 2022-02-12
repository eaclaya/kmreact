
import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContent } from './DrawerContent';
import { InvoiceStackScreen, ProductStackScreen, ClientStackScreen } from "./StackNavigator";
import BottomTabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} /> }>
      <Drawer.Screen name="Clientes" component={ClientStackScreen} />
      <Drawer.Screen name="Facturas" component={BottomTabNavigator} />
      <Drawer.Screen name="Productos" component={ProductStackScreen} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;