import React from 'react';
import { useState } from 'react';
import {View, Text, Button, SafeAreaView, ScrollView, StatusBar, StyleSheet} from 'react-native';
import { ProductList } from '../network';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);

    const fetchData = async() => {
        let user = await AsyncStorage.getItem('user');
        let _products = await AsyncStorage.getItem('products');
        _products = JSON.parse(_products);
        _products = _products ? _products : [];
        user = JSON.parse(user);
        let account_id = user ? user.account_id : null;
        if(_products.length == 0){
            let products = await ProductList(account_id);
            if(products && products.length > 0){
                setProducts(products);
            }
        }
    }

    useEffect(() => {
        fetchData();
      }, [fetchData]);
    

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {products.map(product => (
                    <View key={product.id}>
                        <Text style={styles.item}>{product.notes}</Text>
                    </View>
                ))}
            </ScrollView>
            
        </SafeAreaView>
    );
}
export default ProductScreen;

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