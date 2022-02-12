import React from 'react';
import { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, Title, Drawer, Caption } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sync, uploadClientImage } from '../network';
import * as Network from 'expo-network';

export function DrawerContent(props) {
    const { logout } = React.useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    
    const updateLocalData = async(products, invoices, clientListOne, clientListTwo, clientListThree, clientListFour) => {
        
        for(let index in products){
            products[index].need_update = false;
        }
        for(let index in invoices){
            invoices[index].need_update = false;
        }
        for(let index in clientListOne){
            clientListOne[index].need_update = false;
            clientListOne[index].save_image = false;
            clientListOne[index].save_location = false;
        }
        for(let index in clientListTwo){
            clientListTwo[index].need_update = false;
            clientListTwo[index].save_image = false;
            clientListTwo[index].save_location = false;
        }
        for(let index in clientListThree){
            clientListThree[index].need_update = false;
            clientListThree[index].save_image = false;
            clientListThree[index].save_location = false;
        }
        for(let index in clientListFour){
            clientListFour[index].need_update = false;
            clientListFour[index].save_image = false;
            clientListFour[index].save_location = false;
        }
        console.log('Before remove LS');
        await AsyncStorage.removeItem('products');
        await AsyncStorage.removeItem('invoices');
        await AsyncStorage.removeItem('clients_one');
        await AsyncStorage.removeItem('clients_two');
        await AsyncStorage.removeItem('clients_three');
        await AsyncStorage.removeItem('clients_four');
        await AsyncStorage.removeItem('clients');
        console.log('Before add LS');
        await AsyncStorage.setItem('clients_one', JSON.stringify(clientListOne));
        await AsyncStorage.setItem('clients_two', JSON.stringify(clientListTwo));
        await AsyncStorage.setItem('clients_three', JSON.stringify(clientListThree));
        await AsyncStorage.setItem('clients_four', JSON.stringify(clientListFour));

        await AsyncStorage.setItem('products', JSON.stringify([]));
        await AsyncStorage.setItem('invoices', JSON.stringify([]));

        console.log('After add LS');
    }

    const syncData = async() => {

        setLoading(true);
        let clients = [];
        let products = [];
        let invoices = [];
        let clientImages = [];
        let clientListOne = await AsyncStorage.getItem('clients_one');
        let clientListTwo = await AsyncStorage.getItem('clients_two');
        let clientListThree = await AsyncStorage.getItem('clients_three');
        let clientListFour = await AsyncStorage.getItem('clients_four');
        clientListOne = clientListOne ? clientListOne : [];
        clientListOne = JSON.parse(clientListOne);
        clientListTwo = clientListTwo ? clientListTwo : [];
        clientListTwo = JSON.parse(clientListTwo);
        clientListThree = clientListThree ? clientListThree : [];
        clientListThree = JSON.parse(clientListThree);
        clientListFour = clientListFour ? clientListFour : [];
        clientListFour = JSON.parse(clientListFour);
        let clientList = []; 
        let _clients = clientListOne.concat(clientListTwo).concat(clientListThree).concat(clientListFour);
        let _invoices = await AsyncStorage.getItem('invoices');
        let _products = await AsyncStorage.getItem('products');
        let _user = await AsyncStorage.getItem('user');
        _products = JSON.parse(_products);
        _products = _products ? _products : [];
        _invoices = JSON.parse(_invoices);
        _invoices = _invoices ? _invoices : [];
        _user = JSON.parse(_user);
        let _item = null;
        
        
        for(let index in _clients){
            _item = _clients[index];
            if(_item.need_update){
                clients.push(_item);
                if(_item.save_image){
                    clientImages.push(_item);
                }
            }
            
        }
        for(let index in _invoices){
            _item = _invoices[index];
            if(_item.need_update){
                invoices.push(_item);
            }
        }
        for(let index in _products){
            _item = _products[index];
            if(_item.need_update){
                products.push(_item);
            }
        }
        const result = await sync({clients: clients, invoices: invoices, products: products, user: _user});
        
        for(let index in clientImages){
            let client = clientImages[index];
            console.log('clientImage => ', client);
            let data = new FormData()
            data.append('client', client.id);
            data.append('file', client.image);
            let result = await uploadClientImage(data);        
        }
        if(result && result.success){
            Alert.alert('Datos guardados', 'Sincronizacion completada');
            console.log('Datos guardado', 'Sincornizacion completada');
            updateLocalData(_products, _invoices, clientListOne, clientListTwo, clientListThree, clientListFour);
            
        }else{
            Alert.alert('Error', 'No tienes conexion a internet');
        }
        
        setLoading(false);
    }
    if(loading){
        return (
            <View style={[styles.container, styles.horizontal]}>
            
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        );
      }
    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView style={styles.section}>
                <View style={styles.item} >
                    <Text onPress={() => syncData()}><Icon name="sync" style={styles.icon} /> Sincronizar</Text>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem icon={({color, size}) => (
                    <Icon
                    name="logout"
                    color={size}
                    size={size}
                    />
                )}
                label="Salir"
                onPress={() => logout()}
                 />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginTop: 15
    },
    item: {
        marginHorizontal: 20
    },
    icon: {
        fontSize: 20
    },
    drawerSection: {
        marginTop: 15
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: "#ddd",
        borderTopWidth: 1
    },
    container: {
        flex: 1,
        justifyContent: "center"
      },
      horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
      }
});