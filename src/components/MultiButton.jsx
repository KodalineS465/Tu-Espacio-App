import React, { useState, useEffect } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MultiButton = ({ options, onSelect, text }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [tempSelectedOptions, setTempSelectedOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        if (!modalVisible) {
            setTempSelectedOptions(selectedOptions);
        }
    }, [modalVisible]);

    const toggleOption = (option) => {
        const index = tempSelectedOptions.indexOf(option);
        if (index === -1) {
            setTempSelectedOptions([...tempSelectedOptions, option]);
        } else {
            const newOptions = tempSelectedOptions.filter((item) => item !== option);
            setTempSelectedOptions(newOptions);
        }
    };

    const handleConfirm = () => {
        setSelectedOptions(tempSelectedOptions);
        onSelect(tempSelectedOptions);
        setModalVisible(false);
    };

    const handleCancel = () => {
        setTempSelectedOptions(selectedOptions);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.buttonText}>{text}</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    handleCancel();
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionButton,
                                    tempSelectedOptions.includes(option) && styles.selectedOption,
                                ]}
                                onPress={() => toggleOption(option)}
                            >
                                <Text style={[styles.optionText, tempSelectedOptions.includes(option) && { color: 'black' }]}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.confirmButtonText}>Listo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancel}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    optionButton: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: 200
    },
    selectedOption: {
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginVertical: 1,
    },
    optionText: {
        color: 'black',
        fontSize: 15,
    },
    confirmButton: {
        backgroundColor: '#0f1035',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: 100,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    cancelButton: {
        marginTop: 10,
    },
    cancelButtonText: {
        color: 'red',
        fontSize: 16,
    },
    show: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#e6e6e6',
        width: '90%',
    },
    buttonText: {
        color: 'gray',
        fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MultiButton;