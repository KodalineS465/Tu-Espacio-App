import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Modal} from 'react-native';

const ProfileInfo = ({ name, image, email, verified, firstName }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={image ? { uri: image } : require("../assets/profile.png")}
                            style={styles.image}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.mainText}>{name}</Text>
                        <View style={styles.row}>
                            <Image
                                source={require('../assets/eye.png')}
                                style={styles.icon}
                            />
                            <Text style={styles.text}
                                  onPress={() => {setModalVisible(true);}}
                            >Mostrar perfil</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.squareContainer}>
                                <View style={styles.imageUserContainer}>
                                    <Image
                                        source={image ? { uri: image } : require("../assets/profile.png")}
                                        style={styles.imageUser}
                                    />
                                </View>
                                <Text style={styles.centerText}>{firstName}</Text>
                            </View>
                            <View style={styles.textUserContainer}>
                                <Text style={styles.textUserBold}>Nombre</Text>
                                <Text style={styles.textUser}>{name}</Text>
                                <Text style={styles.textUserBold}>Correo</Text>
                                <Text style={styles.textUser}>{email}</Text>
                                <Text style={styles.textUserBold}>Verificado</Text>
                                <Text style={styles.textUser}>{verified ? 'Sí ✓' : 'No ×'}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'white',
        backgroundColor: 'white'
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        marginRight: 10,
    },
    row: {
        flexDirection: 'row',
        paddingTop: 10
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    icon: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
        marginRight: 5
    },
    textContainer: {
        flex: 1
    },
    mainText: {
        fontSize: 18,
        marginTop: 15
    },
    text: {
        fontSize: 14,
        color: 'gray'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    squareContainer: {
        width: 300,
        height: 250,
        backgroundColor: '#0f1035',
        borderColor: '#0f1035',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    imageUserContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageUser: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 2
    },
    centerText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    textUserContainer: {
        paddingTop: 15,
    },
    textUser: {
        fontSize: 18,
        color: 'black',
        marginTop: 10,
        textAlign: 'center',
    },
    textUserBold: {
        fontSize: 18,
        color: 'black',
        marginTop: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    closeButton: {
        backgroundColor: "#0f1035",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
});

export default ProfileInfo;