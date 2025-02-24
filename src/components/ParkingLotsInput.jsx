import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput } from 'react-native';

const ParkingLotsInput = ({ onNumberSelected }) => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [customNumber, setCustomNumber] = useState('');
    const [buttonTextColors, setButtonTextColors] = useState({
        0: 'black',
        1: 'black',
        2: 'black',
        3: 'black'
    });

    const returnNumber = (number) => {
        setButtonTextColors(prevState => ({
            ...prevState,
            [number]: 'white'
        }));

        if (selectedButton && selectedButton !== number) {
            setButtonTextColors(prevState => ({
                ...prevState,
                [selectedButton]: 'black'
            }));
        }

        setSelectedButton(number);
        setCustomNumber('');
        onNumberSelected(number);
    };

    const handleCustomNumber = () => {
        if (selectedButton) {
            setButtonTextColors({
                0: 'black',
                1: 'black',
                2: 'black',
                3: 'black'
            });
            setSelectedButton(null);
        }

        const number = parseInt(customNumber);
        if (!isNaN(number) && number > 0) {
            onNumberSelected(number);
        }
    };

    const handleBlur = () => {
        handleCustomNumber();
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonsRow}>
                {[0, 1, 2, 3].map(number => (
                    <TouchableOpacity
                        key={number}
                        onPress={() => returnNumber(number)}
                        style={[
                            styles.button,
                            selectedButton === number && styles.selectedButton,
                            { backgroundColor: selectedButton === number ? '#0F1035' : 'white' }
                        ]}
                    >
                        <Text style={[styles.buttonText, { color: buttonTextColors[number] }]}>{number}</Text>
                    </TouchableOpacity>
                ))}
                <TextInput
                    style={styles.input}
                    onChangeText={text => setCustomNumber(text)}
                    value={customNumber}
                    keyboardType="numeric"
                    placeholder="numero exacto"
                    onBlur={handleBlur}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20
    },
    buttonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    button: {
        borderRadius: 50,
        borderColor: '#E6E6E6',
        borderWidth: 3,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15
    },
    selectedButton: {
        backgroundColor: '#0F1035'
    },
    buttonText: {
        fontSize: 14
    },
    input: {
        height: 50,
        borderColor: '#E6E6E6',
        borderWidth: 3,
        width: 80,
        paddingHorizontal: 10,
        color: 'black',
        borderRadius: 3
    }
});

export default ParkingLotsInput;
