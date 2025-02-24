import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Image} from 'react-native';

const SignOutButton = ({onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Image
                    source={require('../assets/close.png')}
                    style={styles.icon}
                />
                <Text style={styles.text}>Cerrar sesion</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20
    },
    button: {
        backgroundColor: 'white',
        width: '100%',
        padding: 15,
        borderColor: 'white',
        borderWidth: 1.5,
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row'
    },
    text: {
        color: '#0f0135',
        fontSize: 23,
        fontWeight: 'bold',
        alignItems: 'center',
        textDecorationLine: 'underline',
        fontStyle: 'italic'
    },
    icon: {
        width: 25,
        height: 25,
        marginRight: 30,
        marginLeft: 30
    }
});

export default SignOutButton;
