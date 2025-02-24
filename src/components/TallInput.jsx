import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

const TallInput = ({placeholder, value, onChangeText }) => {
    const handleBlur = () => {
        console.log('El TextInput ha perdido el foco');
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                style={styles.input}
                onBlur={handleBlur}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%',
        height: 100,
        padding: 15,
        borderColor: '#e6e6e6',
        borderWidth: 2,
        color: 'black'
    }
});

export default TallInput;