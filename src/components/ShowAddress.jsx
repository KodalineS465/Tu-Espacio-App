import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ShowAddress = ({ text, onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.squareContainer} onPress={onPress}>
                <Text style={styles.text}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    squareContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#e6e6e6',
        width: '90%',
        flex: 1
    },
    text: {
        color: 'gray',
        fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ShowAddress;
