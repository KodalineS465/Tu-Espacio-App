import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';

const RoundButtons = ({ onNumberSelected }) => {
    const [storedValue, setStoredValue] = useState(null);
    const [customNumber, setCustomNumber] = useState('');

    const handleNumberSelection = (number) => {
        setStoredValue(number);
        onNumberSelected(number);
    };

    const handleCustomNumber = () => {
        const number = parseInt(customNumber);
        if (!isNaN(number)) {
            setStoredValue(number);
            onNumberSelected(number);
        } else {
            console.log('El número ingresado no es válido');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonsRow}>
                {[0, 1, 2, 3].map(number => (
                    <TouchableOpacity
                        key={number}
                        onPress={() => handleNumberSelection(number)}
                        style={[
                            styles.button,
                            storedValue === number && styles.selectedButton,
                            { backgroundColor: storedValue === number ? '#0F1035' : 'white' }
                        ]}
                    >
                        <Text style={[styles.buttonText, { color: storedValue === number ? 'white' : 'gray' }]}>
                            {number}
                        </Text>
                    </TouchableOpacity>
                ))}
                <TextInput
                    style={styles.input}
                    onChangeText={text => setCustomNumber(text)}
                    value={customNumber}
                    keyboardType="numeric"
                    placeholder="num"
                    onSubmitEditing={handleCustomNumber}
                />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
        width: '100%'
    },
    buttonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        width: '90%'
    },
    button: {
        borderRadius: 50,
        borderColor: '#E6E6E6',
        borderWidth: 3,
        paddingVertical: 8,
        paddingHorizontal: 13,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15
    },
    selectedButton: {
        backgroundColor: '#0F1035'
    },
    buttonText: {
        fontSize: 14,
        color: 'white' // Set the default color for the button text
    },
    input: {
        height: 50,
        borderColor: '#E6E6E6',
        borderWidth: 3,
        width: 80,
        paddingHorizontal: 10,
        color: 'black',
        borderRadius: 8,
        fontSize: 14
    }
});

export default RoundButtons;
