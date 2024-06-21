import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';

const BlueButton = ({ text, onPress, disabled }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, disabled && styles.disabledButton]}
                onPress={onPress}
                disabled={disabled}
            >
                <Text style={[styles.text, disabled && styles.disabledText]}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20
    },
    button: {
        backgroundColor: '#0F1035',
        width: 250,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: '#A9A9A9',
    },
    text: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    disabledText: {
        color: '#666',
    },
});

export default BlueButton;