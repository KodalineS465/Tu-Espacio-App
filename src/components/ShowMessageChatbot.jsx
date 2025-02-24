import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

const ShowMessageChatbot = ({ onPress }) => {

    return (
        <View>
                <TouchableOpacity style={styles.container} onPress={onPress}>
                    <View style={styles.leftContainer}>
                        <View style={styles.containerImage}>
                            <View style={styles.imageContainerPerson}>
                                <Image
                                    source={require('../assets/bot-image.png')}
                                    style={styles.image}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.centerContainer}>
                        <View style={styles.row}>
                            <Text style={styles.blackText}>C H A T B O T</Text>
                        </View>
                        <View style={styles.row}>
                            <Image
                                source={require('../assets/notification-bell.png')}
                                style={styles.icon}
                            />
                            <Text style={styles.boldText}>¿En que puedo ayudarte?</Text>
                        </View>
                    </View>
                    <View style={styles.rightContainer}>
                        <Text style={styles.textTimeLeft}>Servicio 24/7</Text>
                    </View>
                </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 2
    },
    containerImage: {
        flexDirection: 'row',
        padding: 10
    },
    row: {
        flexDirection: 'row',
    },
    imageContainerPerson: {
        margin: 5,
        borderRadius: 100,
        overflow: 'hidden',
        position: 'relative',
        borderColor: 'black',
        borderWidth: 2
    },
    leftContainer: {
        backgroundColor: '#e6e6e6',
        paddingVertical: 10,
        width: '25%'
    },
    centerContainer: {
        backgroundColor: '#e6e6e6',
        width: '60%',
        paddingTop: 30,
        alignItems: "center"
    },
    rightContainer: {
        backgroundColor: '#e6e6e6',
        width: '15%',
        height: 'auto',
        justifyContent: 'center',
        paddingLeft: 10,
    },
    textContainer: {
        flexDirection: 'row',
    },
    image: {
        width: 65,
        height: 65,
        opacity: 1
    },
    icon: {
        width: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        paddingHorizontal: 3
    },
    boldText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        paddingTop: 5,
        paddingLeft: 5
    },
    blackText: {
        color: 'black',
        fontSize: 16,
    },
});

export default ShowMessageChatbot;