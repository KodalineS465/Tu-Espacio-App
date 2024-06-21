import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const CheckCircle = ({ title, isChecked, onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.confirmationButton, isChecked ? styles.confirmedButton : styles.unconfirmedButton]}
                onPress={onPress}
            >
                <Text style={styles.buttonText}>{isChecked ? "✓" : ' '}</Text>
            </TouchableOpacity>
            <Text style={styles.text}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
        marginTop: 10,
        marginLeft: 10,
        color: 'black'
    },
    confirmationButton: {
        marginTop: 10,
        width: 25,
        height: 25,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#0f1035'
    },
    confirmedButton: {
        backgroundColor: '#0f1035',
        borderColor: '#0f1035',
    },
    unconfirmedButton: {
        backgroundColor: 'transparent',
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
    },
});

export default CheckCircle;