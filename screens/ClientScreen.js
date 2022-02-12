import React from 'react';
import { useState } from 'react';
import {View, 
        Text, 
        TextInput, 
        Pressable, 
        ActivityIndicator, 
        ScrollView,
        StatusBar, 
        StyleSheet, 
        FlatList} from 'react-native';
import { ClientList, searchClient } from '../network';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClientScreen = ({ navigation }) => {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [clientListOne, clientListTwo, clientListThree, clientListFour] = useState([]);

    const fetchData = async() => {
        setLoading(true);
        let user = await AsyncStorage.getItem('user');
        let _clients = await AsyncStorage.getItem('clients_one');
        _clients = JSON.parse(_clients);
        _clients = _clients ? _clients : [];
        user = JSON.parse(user);
        let account_id = user ? user.account_id : null;
        console.log('BEFORE CLIENTS LOAD => ', _clients.length);
        if(_clients.length == 0){
            _clients = await ClientList(account_id);
        }
        const clientList = _clients.slice(0,100);
        console.log('clientList => ', clientList.length);
        if(_clients && _clients.length >= 0){
            setClients(clientList);
            if(_clients.length > 5000){

                let clientListOne = _clients.slice(0, 5000);
                let clientListTwo = _clients.slice(5000, 10000);
                let clientListThree = _clients.slice(10000, 15000);
                let clientListFour = _clients.slice(15000, 20000);

                await AsyncStorage.setItem('clients_one', JSON.stringify(clientListOne));
                await AsyncStorage.setItem('clients_two', JSON.stringify(clientListTwo));
                await AsyncStorage.setItem('clients_three', JSON.stringify(clientListThree));
                await AsyncStorage.setItem('clients_four', JSON.stringify(clientListFour));
                console.log('Asyncstorage => save');
            }
            
        }
        setLoading(false);
    }


    const handleSearchClient = async() => {
        console.log('handleSearchClient');
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
        console.log('clients length => ', _clients.length);
        if(search != ''){
            let value = search.toLowerCase().trim();
            
            const clientItem = _clients[0];
            
            for(let index in _clients){
                if(clientList.length >= 100){
                    break;
                }
                let item = _clients[index];
                if(typeof item === 'object'){
                    if(item){
                        let name = item.name ? item.name.toLowerCase() : '';
                        let phone = item.phone ? item.phone.toLowerCase() : '';
                        if(name.indexOf(value) >= 0 || phone.indexOf(value) >= 0){
                            clientList.push(item);
                        }
                    }
                    
                }
                
            }
        }else{
            clientList = _clients.slice(0,100);
        }
        setClients(clientList);
        
    } 

    const ItemView = ({item}) => {
        return (
            <Pressable style={{width: '100%'}} onPress={() => navigation.push('ClientForm', {client: item})}>
                <Text style={styles.itemName} >{item.name}</Text>
                <Text style={styles.itemPhone} >{item.phone}</Text>
            </Pressable>
        );
    }

    const ItemSeparatorView = () => {
        return (
            <View style={{height: 0.5, width: '100%', backgroundColor: '#ddd'}}/>
        );
    }

    useEffect(() => {
        fetchData();
      }, []);
    
    if(loading){
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large"></ActivityIndicator>
        </View>
    );
    }
    
    return (
        
        <View style={styles.container}>
            <View style={styles.searchWrapper}>
                <View style={styles.searchInput}>
                    <TextInput style={styles.input} 
                        placeholder="Buscar cliente"  
                        onChangeText={(value) => setSearch(value)}
                    />
                </View>
                <View style={styles.searchButton}>
                    <Pressable style={{width: '100%'}} onPress={() => handleSearchClient()}>
                        <Text style={{
                                color: 'white', 
                                lineHeight: 50, 
                                textAlign: 'center', 
                                fontSize: 15, 
                                textTransform: 'uppercase', 
                                fontWeight: 'bold'}}>Buscar</Text>
                    </Pressable>
                </View>
            </View>
            
            <FlatList
                data={clients}
                keyExtractor={(item, index) => index.toString()} 
                ItemSeparatorComponent={ItemSeparatorView}
                renderItem={ItemView}
            />
        </View>
    );
}
export default ClientScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
      },
      itemName: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingTop: 10,
        marginVertical: 0,
        marginHorizontal: 0,
        fontSize: 12
      },
      itemPhone: {
        color: '#008b8b',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingBottom: 10,
        marginVertical: 0,
        marginHorizontal: 0,
      },
      title: {
        fontSize: 16,
      },
      input: {
        height: 44,
        padding: 10,
        backgroundColor: '#f6f6f6',
        marginBottom: 10,
        marginHorizontal: 10
      },
      searchWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        
      },    
      searchInput: {
            width: '70%'
      },
      searchButton: {
            backgroundColor: '#20b2aa',
            width: '30%'
      }
});