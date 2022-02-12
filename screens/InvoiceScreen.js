import * as React from 'react';
import { useState } from 'react';
import {View, Text, Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Alert} from 'react-native';
import { InvoiceList } from '../network';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import NetInfo from '@react-native-community/netinfo';

const InvoiceScreen = ({ navigation }) => {
    const [invoices, setInvoices] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    const fetchData = async() => {
        // checkInternetConnection();
        let user = await AsyncStorage.getItem('user');
        let _invoices = await AsyncStorage.getItem('invoices');
        _invoices = JSON.parse(_invoices);
        _invoices = _invoices ? _invoices : [];
        user = JSON.parse(user);
        let account_id = user ? user.account_id : null;
        if(_invoices.length == 0){
            _invoices = await InvoiceList(account_id);
        }
        setInvoices(_invoices);
        await AsyncStorage.setItem('invoices', JSON.stringify([]));
    }

    const checkInternetConnection = () => {
        NetInfo.fetch().then(connection => {
            if(connection.isConnected){
                setIsConnected(true);
                Alert.alert('Notificacion', 'LOAD FROM INTERNET');
            }else{
                setIsConnected(false);
                Alert.alert('Notificacion', 'LOAD FROM LOCALSTORAGE');
            }    
        });
    }
    
    useEffect(() => {
        fetchData();
            
      }, [fetchData]);
    

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {invoices.map(invoice => (
                    <View key={invoice.id}>
                        <Text style={styles.item}>{invoice.invoice_number}</Text>
                    </View>
                ))}
            </ScrollView>
            
        </SafeAreaView>
    );
}
export default InvoiceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
      },
      item: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 0,
        marginHorizontal: 0,
      },
      title: {
        fontSize: 16,
      },
});