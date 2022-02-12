import React from 'react';
import {View, Text, TextInput, Button, Image, StyleSheet} from 'react-native';
import { AuthContext } from '../components/context';

const LoginScreen = ({ navigation }) => {
    const [data, setData] = React.useState({
        email: '',
        password: ''
    });

    const handleEmailChange = (val) => {
        setData({
            ...data,
            email: val
        });
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const { login } = React.useContext(AuthContext);
    return (
        <View style={styles.container}>
        <Text style={styles.inputext}>Acceso al sistema</Text>
          <View style={styles.logoContainer}>
              <Image 
              style={styles.logo}
              source={require('../assets/icon.png')}
            />
          </View>
        
          <TextInput
            onChangeText={(value) => handleEmailChange(value)}
             label='Email'
            style={styles.input}
          />
          <TextInput
            onChangeText={(value) => handlePasswordChange(value)}
            label='Password'
            secureTextEntry={true}
            style={styles.input}
          />
          
          <Button
            title={'Login'}
            style={styles.button}
            onPress={() => login(data.email, data.password)}
          />
        </View>
  
    );
}
export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    input: {
        
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
      },
      inputext: {
        fontSize: 20,
        color: '#aaa',
        height: 44,
        padding: 10,
        textAlign:'center',
        fontWeight:'bold',
        textTransform: 'uppercase',
        marginBottom: 10,
      },
      button: {
        backgroundColor: 'red',
        color: 'red',
        width: 200
      },
      
      logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      logo : {
        width: 200,
        height: 100,
      }
});