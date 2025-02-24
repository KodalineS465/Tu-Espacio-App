import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const MainHeader = () => {
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
        backgroundColor: 'white',
        width: '100%'
    },
    logo: {
        width: 50,
        height: 50,
        marginTop: 5,
    }
});

export default MainHeader;