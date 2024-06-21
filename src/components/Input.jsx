import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

const Input = ({placeholder, value, onChangeText, onBlur, onFocus, secureTextEntry, style}) => {
    return (
        <View style={styles.container}>
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                style={[styles.input, style]}
                secureTextEntry={!!secureTextEntry}
                onBlur={onBlur}
                onFocus={onFocus}
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
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        width: '100%',
        padding: 15,
        alignItems: 'center',
        borderColor: '#CCCCCC',
        borderWidth: 1.5,
    }
});

export default Input;
