import * as React from 'react';
import { useState } from 'react';
import * as Network from 'expo-network';
import {
        View, 
        Text, 
        Button, 
        SafeAreaView, 
        TextInput, 
        ScrollView, 
        Image,
        ActivityIndicator,
        StyleSheet,
        Alert} from 'react-native';
import { ClientList, syncClients, saveClientLocation, uploadClientImage } from '../network';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';


const ClientFormScreen = ({ route, navigation }) => {
    const { client } = route.params;
    const [data, setData] = React.useState({
        name: '',
        phone: '',
        vat_number: ''
    });
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [name, phone, vat_number, latitude, longitude] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        (async () => {
            setData({
                ...data,
                name: client.name ? client.name : '',
                phone: client.phone ? client.phone : '',
                vat_number: client.vat_number ? client.vat_number : '',
                address1: client.address1 ? client.address1 : '',
                type: client.type ? client.type : '',
                latitude: client.latitude ? parseFloat(client.latitude) : 0,
                longitude: client.longitude ? parseFloat(client.longitude) : 0,
            });
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            
        })();
      }, []);
      
    let text = 'Obteniendo ubicacion..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = 'LATITUD: ' + location.coords.latitude + '  LONGITUD: ' + location.coords.longitude;
    }

    const getMimeType = (ext) => {
      // mime type mapping for few of the sample file types
      switch (ext) {
        case 'pdf': return 'application/pdf';
        case 'jpg': return 'image/jpeg';
        case 'jpeg': return 'image/jpeg';
        case 'png': return 'image/png';
      }
    }

    const saveClientLocalStorage = async(client) => {
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
        let clients = clientListOne.concat(clientListTwo).concat(clientListThree).concat(clientListFour);
        let item = null;
        let itemId = -1;
        for(let index in clients){
            item = clients[index];
            if(item.id == client.id){
                itemId = index;
                clients[index] = client;
            }
        }
        if(itemId >= 0 && itemId < 5000) {
          clientListOne[itemId] = client;
          await AsyncStorage.setItem('clients_one', JSON.stringify(clientListOne));
        }
        if(itemId >= 5000 && itemId < 10000) {
          clientListTwo[itemId] = client;
          await AsyncStorage.setItem('clients_two', JSON.stringify(clientListTwo));
        }
        if(itemId >= 10000 && itemId < 15000) {
          clientListThree[itemId] = client;
          await AsyncStorage.setItem('clients_three', JSON.stringify(clientListThree));
        }
        if(itemId >= 15000 && itemId < 20000) {
          clientListFour[itemId] = client;
          await AsyncStorage.setItem('clients_four', JSON.stringify(clientListFour));
        }
    }

    const pickImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      try{
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.1,
        });
    
        setLoading(true);
        if (!result.cancelled) {
          setImage(result.uri);
          let filename = result.uri.split('/').pop();
          const extArr = /\.(\w+)$/.exec(filename);
          const type = getMimeType(extArr[1]);
          const imageData = { uri: result.uri, name: filename, type }
          client.image = imageData;
          client.save_image = true;
          client.need_update = true;
          let successText = 'Imagen guardada local';
          let data = new FormData()
          data.append('client', client.id);
          data.append('file', imageData);
          let response = await uploadClientImage(data);
          if(response.success){
            successText = 'Imagen guardada en la nube';
            client.save_image = false;
            client.need_update = false;
          }
          saveClientLocalStorage(client);
          console.log('client => ', client)
          Alert.alert('Ubicacion guardada', successText);
          setLoading(false);
        }else{
          Alert.alert('Ocurrio un error', 'La imagen no se puede guardar, usa otra.');
          setTimeout(function(){navigation.navigate('Client') }, 2000);
        }
      }catch(error){
        Alert.alert('Ocurrio un error', 'La imagen no se puede guardar, usa otra.');
        setTimeout(function(){navigation.navigate('Client') }, 2000); 
      }
      
    };

    const saveLocation = async() => { 
        setLoading(true);
        let user = await AsyncStorage.getItem('user');
        user = JSON.parse(user);
        client.name = data.name;
        client.phone = data.phone;
        client.vat_number = data.vat_number;
        client.type = data.type;
        client.user_id = user.id;
        if(location){
            client.latitude = location.coords.latitude;
            client.longitude = location.coords.longitude;
        }

        client.need_update = true;
        client.save_location = true;
        let successText = 'Ubicacion guardada local';
        const _client = await saveClientLocation({client: client});
        if(_client && _client.id){
            client.need_update = false;
            client.save_location = false;
            successText = 'Ubicacion guardada en la nube';
        }
        
        saveClientLocalStorage(client);
        
        Alert.alert('Ubicacion guardada', successText);
        setLoading(false);
    }

    const saveClient = async() => {
        setLoading(true);
        client.name = data.name;
        client.phone = data.phone;
        client.vat_number = data.vat_number;
        client.address1 = data.address1;
        client.type = data.type;
        client.need_update = true;
        let successText = 'Cliente guardado local';
        
        const formData = [];
        formData.push(client);
        // const _client = await syncClients(formData);
        // if(_client && _client.id){
        //     client.need_update = false;
        //     successText = 'Cliente guardado en la nube';
        // }
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
        let clients = clientListOne.concat(clientListTwo).concat(clientListThree).concat(clientListFour);
        let item = null; let itemId = -1;
        for(let index in clients){
            item = clients[index];
            if(item.id == client.id){
                itemId = index;
                clients[index] = client;
            }
        }
        if(itemId >= 0 && itemId < 5000) {
          clientListOne[itemId] = client;
          await AsyncStorage.setItem('clients_one', JSON.stringify(clientListOne));
        }
        if(itemId >= 5000 && itemId < 10000) {
          clientListTwo[itemId] = client;
          await AsyncStorage.setItem('clients_two', JSON.stringify(clientListTwo));
        }
        if(itemId >= 10000 && itemId < 15000) {
          clientListThree[itemId] = client;
          await AsyncStorage.setItem('clients_three', JSON.stringify(clientListThree));
        }
        if(itemId >= 15000 && itemId < 20000) {
          clientListFour[itemId] = client;
          await AsyncStorage.setItem('clients_four', JSON.stringify(clientListFour));
        }
        Alert.alert('Cliente guardado', successText);
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
        <SafeAreaView style={styles.container}>
            <ScrollView>
              <Text style={styles.inputlabel}>Nombre</Text>
            <TextInput
             label='Name'
             placeholder='Nombre'
             value={ data.name }
             onChangeText={(value) => setData({...data, name: value})}
            style={styles.input}
          />
          <Text style={styles.inputlabel}>Telefono</Text>
          <TextInput
            label='Phone'
            placeholder='Telefono'
            value={data.phone}
            style={styles.input}
            onChangeText={(value) => setData({...data, phone: value})}
          />
          <Text style={styles.inputlabel}>RTN</Text>
          <TextInput
            label='RTN'
            placeholder='RTN'
            value={data.vat_number}
            style={styles.input}
            onChangeText={(value) => setData({...data, vat_number: value})}
          />
          <Text style={styles.inputlabel}>Tipo</Text>
          <TextInput
            label='type'
            placeholder='Tipo'
            value={data.type}
            style={styles.input}
            onChangeText={(value) => setData({...data, type: value})}
          />
          <Text style={styles.inputlabel}>Direccion</Text>
        <TextInput
            label='Address'
            placeholder='Direccion'
            value={data.address1}
            style={styles.input}
            onChangeText={(value) => setData({...data, address1: value})}
          />

          <View style={styles.location}>
            <Text style={styles.label}>Ubicacion actual</Text>  
            {location !== null ? (<View style={styles.wrapper}><Text style={styles.label}>{text}</Text><Button
                title={'Pinear Ubicacion de Cliente'}
                
                onPress={() => saveLocation()}
            /></View>)
            : (<Text style={styles.label}>No disponible</Text>) }
            
          </View>

          <View style={styles.location}>
            <Text style={styles.label}>Ubicacion cliente</Text>  
            <Text style={styles.label}>LATITUD: {data.latitude}  LONGITUD: {data.longitude}</Text>
          </View>

         {data.longitude && data.latitude  ? (
             <MapView style={styles.map} 
                    initialRegion={{
                        latitude: data.latitude,
                        longitude: data.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
            >
                    <MapView.Marker
                        coordinate={{latitude: data.latitude,
                        longitude: data.longitude}}
                        title={"title"}
                        description={"description"}
                    />
            </MapView>
         ) : (<Text style={styles.inputext}>No se pudo cargar el mapa...</Text>  ) }  

          <View style={styles.wrapper}>
              <Button title="Subir Foto de negocio" onPress={pickImage} />
              {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginHorizontal: 'auto', marginVertical: 20 }} />}
          </View>
          <View style={styles.button}>
            <Button
                title={'Guardar'}
                color="#000"
                onPress={() => saveClient()}
            />
          </View>
          
            </ScrollView>
            
        </SafeAreaView>
    );
}
export default ClientFormScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginBottom: 20,
      },
      input: {
        height: 44,
        padding: 10,
        backgroundColor: '#f6f6f6',
        marginBottom: 10,
        marginHorizontal: 10
      },
      inputext: {
        
        height: 44,
        padding: 10,
        textAlign:'center',
        fontWeight:'bold',
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 10
      },
      label: {
        padding: 0,
        textAlign:'center',
        fontWeight:'bold',
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 10,
        fontSize: 12
      },
      inputlabel: {
        padding: 0,
        textAlign:'left',
        fontWeight:'bold',
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 10,
        fontSize: 12
      },
      button: {
        backgroundColor: 'red',
        color: 'red',
        marginHorizontal: 20,
      },
      map: {
        marginBottom: 50,
        height: 300,
        marginHorizontal: 20
      },
      location: {
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
          marginBottom: 20,
         
      },
      wrapper: {
        marginVertical: 10,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        
      },
      
      horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
      }

});