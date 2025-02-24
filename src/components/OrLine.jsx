import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

const OrLine = ({ }) => {
    return (
        <View style={styles.container}>
            <View style={styles.linea}></View>
            <Text style={styles.text}>o</Text>
            <View style={styles.linea}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10
    },
    linea: {
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 3,
        width: '100%',
        paddingVertical: 10,
        flex: 1
    },
    text:{
        paddingHorizontal: 10,
        fontSize: 20,
        color: '#0f1035',
        lineHeight: 20,
        marginTop: 16
    }
});

export default OrLine;
