import * as React from 'react';
import axios from 'axios';
import {API_URL} from '@env';

export const AuthUser = async(email, password) => {
    try{
        let credentials = {
            email: email,
            password: password
        };
        let url = config.end_point + 'login';
        let response = await axios.post(url, credentials);
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const ClientList = async(account) => {
    try{
        let url = config.end_point + 'clients/' + account;
        console.log('ClientList => ', url);
        let response = await axios.get(url);
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const searchClient = async(value) => {
    try{
        let url = config.end_point + 'clients/search/' + value;
        let response = await axios.get(url);
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const InvoiceList = async(account) => {
    try{
        let url = config.end_point + 'invoices/' + account;
        let response = await axios.get(url);
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const ProductList = async(account) => {
    try{
        let url = config.end_point + 'products/' + account;
        let response = await axios.get(url);
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const syncClients = async(data) => {
    try{
        let url = config.end_point + 'clients';
        let response = await axios.post(url, data );
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const sync = async(data) => {
    try{
        let url = config.end_point + 'sync';
        let response = await axios.post(url, data );
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const saveClientLocation = async(data) => {
    try{
        let url = config.end_point + 'location';
        let response = await axios.post(url, data );
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

export const uploadClientImage = async(data) => {
    try{
        let url = config.end_point + 'clients/image';
        console.log(url);
        let response = await axios.post(url, data );
        console.log(response.data);
        return response.data;
    }catch(e){
        console.log(e);
        return false;
    }
}

const config = {
    end_point: API_URL
}
