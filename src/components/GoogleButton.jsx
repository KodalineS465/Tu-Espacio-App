import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Image} from 'react-native';

const GoogleButton = ({ title, onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Image
                    source={require('../assets/googleicon.png')}
                    style={styles.icon}
                />
                <Text style={styles.text}>{title}</Text>
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
        width: '80%',
        padding: 15,
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1.5,
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row'
    },
    text: {
        color: 'gray',
        fontWeight: '700',
        fontSize: 18
    },
    icon: {
        width: 25,
        height: 25,
        marginRight: 20,
    }
});

export default GoogleButton;
