import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const GrayHeader = () => {
    return (
        <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')}
                   style={styles.logo}/>
        </View>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        backgroundColor: '#E6E6E6',
        width: '100%'
    },
    logo: {
        width: 50,
        height: 50,
        marginTop: 5,
    }
});

export default GrayHeader;