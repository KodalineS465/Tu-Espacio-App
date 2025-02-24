import React, {useContext, useState} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, Image} from 'react-native';
import UserContext from "../utils/UserProvider";

const OrderBy = ({ visible, onClose }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const {orderBy, setOrderBy } = useContext(UserContext);
    const options = [
        { id: 1, label: 'Nuevo' },
        { id: 2, label: 'Antiguo' },
        { id: 3, label: 'Mayor precio' },
        { id: 4, label: 'Menor precio' },
        { id: 5, label: 'Proximo a terminar' },
    ];

    const handleSelectOption = (optionId) => {
        setSelectedOption(optionId);
        if (optionId === 1) {
            setOrderBy({by: "createdAt", order:"desc"})
        }
        if (optionId === 2) {
            setOrderBy({by: "createdAt", order:"asc"})
        }
        if (optionId === 3) {
            setOrderBy({by: "price", order:"desc"})
        }
        if (optionId === 4) {
            setOrderBy({by: "price", order:"asc"})
        }
        if (optionId === 5) {
            setOrderBy({by: "expiresAt", order:"desc"})
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.row}>
                        <Text style={styles.title}>Ordenar</Text>
                        <View style={styles.leftContainer}>
                            <Image source={require('../assets/order.png')}
                                   style={styles.logo}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.rightContainer}
                            onPress={onClose}
                        >
                            <Image source={require('../assets/close.png')}
                                   style={styles.logoEnd}
                            />
                        </TouchableOpacity>
                    </View>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionButton,
                                selectedOption === option.id && styles.selectedOptionButton,
                            ]}
                            onPress={() => handleSelectOption(option.id)}
                        >
                            <View style={styles.optionContainer}>
                                <View
                                    style={[
                                        styles.optionCircle,
                                        selectedOption === option.id && styles.selectedOptionCircle,
                                    ]}
                                />
                                <Text style={styles.optionLabel}>{option.label}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        width: '80%',
    },
    row:{
        flexDirection: 'row',
    },
    rightContainer:{
        alignItems: 'flex-end',
        backgroundColor: "white",
        width: '20%',
        justifyContent: 'center',
        paddingRight: 5
    },
    leftContainer: {
        alignItems: 'flex-start',
        backgroundColor: "white",
        width: '60%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'gray',
        marginRight: 10,
    },
    selectedOptionCircle: {
        backgroundColor: '#0f1035',
        borderColor: '#0f1035',
    },
    optionLabel: {
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        width: 35,
        height: 35,
        paddingLeft: 20,
    },
    logoEnd: {
        width: 20,
        height: 20,
        alignItems: 'flex-end',
    }
});

export default OrderBy;