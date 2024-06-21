import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

const ShowMessage = ({ onPress, imageProperty, imageSubmitter, submitter, address, inboxTime, message, isSentMessage }) => {
    const [isMessageOpened, setMessageOpened] = useState(false);
    const [opened, setOpened] = useState(false);
    const textStyle = opened ? styles.blackText : styles.boldText;

    // Función para manejar la apertura del mensaje
    const handlePress = () => {
        setOpened(true);
        onPress();
    };


    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <View style={styles.leftContainer}>
                <View style={styles.containerImage}>
                    <View style={styles.imageContainerPerson}>
                        <Image
                            source={imageSubmitter ? {uri: imageSubmitter} : require('../assets/profile.png')}
                            style={styles.image}
                        />
                    </View>
                    <View style={[styles.imageContainerHouse, { marginLeft: -30 }]}>
                        <Image
                            source={imageProperty? {uri: imageProperty} : require('../assets/logo.png')}
                            style={styles.image}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.centerContainer}>
                <View style={styles.row}>
                    <Text style={styles.blackText} numberOfLines={1}>{submitter} • </Text>
                    <Text style={styles.textAddress} numberOfLines={1}>{address}</Text>
                </View>
                <View style={styles.row}>
                    <Image
                        source={isSentMessage ? require('../assets/message-sent.png') : require('../assets/notification-bell.png')}
                        style={styles.icon}
                    />
                    <Text style={[textStyle, { paddingTop: 5 }]} numberOfLines={1}>{message}</Text>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <Text style={styles.textTimeLeft}>{new Date(inboxTime).getHours() + ':' + new Date(inboxTime).getMinutes()}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
    imageContainerHouse: {
        margin: 5,
        borderRadius: 100,
        overflow: 'hidden',
        position: 'relative',
        borderColor: 'black',
        borderWidth: 2
    },
    container: {
        flexDirection: 'row',
        width: '100%',
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 2
    },
    leftContainer: {
        backgroundColor: 'white',
        paddingVertical: 10,
        width: '33%'
    },
    centerContainer: {
        backgroundColor: 'white',
        width: '53%',
        paddingTop: 30,
    },
    rightContainer: {
        backgroundColor: 'white',
        width: '14%',
        paddingTop: 50,
        paddingLeft: 10,
        paddingRight: 5,
    },
    textContainer: {
        flexDirection: 'row',
    },
    buttonContainer: {
        width: 'auto',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    servicesContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: '#002D06',
        width: 'auto',
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
        paddingHorizontal: 3,
        marginRight: 10
    },
    textAddress: {
        color: 'gray',
        fontSize: 16,
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
    textShow: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
});

export default ShowMessage;
