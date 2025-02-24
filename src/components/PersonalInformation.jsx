import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import BlueButton from "./BlueButton";

const PersonalInformation = ({ isVisible, onClose, name, email, editImage, addVerification}) => {
    console.log(name)
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Información Personal</Text>
                    <View style={styles.box}>
                        <Text style={styles.text}>Nombre: {name}</Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.text}>Correo electrónico: {email}</Text>
                    </View>
                    <TouchableOpacity style={styles.box} >
                        <Text style={styles.text}>Foto de perfil</Text>
                        <Text style={styles.editText} onPress={editImage}>Editar</Text>
                    </TouchableOpacity>
                    {/*<View style={styles.box}>
                        <Text style={styles.text} >Verifica tu cuenta</Text>
                        <Text style={styles.editText} onPress={addVerification}>Agregar</Text>
                    </View>*/}
                    <BlueButton text="Cerrar" onPress={onClose} />
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    modalContent: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#0f1035',
    },
    box: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e6e6e6',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    text: {
        color: 'black',
        fontSize: 16,
    },
    editText: {
        color: '#20237E',
        fontSize: 16,
    },
});

export default PersonalInformation;