import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Animated } from 'react-native';

const ShowProperty = ({ onPress, imageSource, textAddress, textDescription, onSwitchOn, onSwitchOff, switchValue }) => {
    const [isOn, setIsOn] = useState(switchValue);
    const position = useState(new Animated.Value(switchValue ? 1 : 0))[0];

    const toggleSwitch = () => {
        setIsOn(!isOn);
        isOn ? onSwitchOn() : onSwitchOff();
        Animated.timing(position, {
            toValue: isOn ? 0 : 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const ballPosition = position.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 30],
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress} style={styles.leftContainer}>
                <View style={styles.imageContainer}>
                    <Image source={{uri: imageSource}} style={styles.image} />
                </View>
            </TouchableOpacity>
            <View style={styles.centerContainer}>
                <Text style={styles.textAddress} numberOfLines={1}>{textAddress}</Text>
                <Text style={styles.textDescription} numberOfLines={3}>{textDescription}</Text>
            </View>
            <View style={styles.rightContainer}>
                <TouchableOpacity onPress={toggleSwitch}>
                    <View style={[styles.switch, isOn ? styles.switchOn : styles.switchOff]}>
                        <Animated.View style={[styles.ball, { transform: [{ translateX: ballPosition }] }]} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 2,
        width: "100%",
        justifyContent: 'center',
        height: 'auto'
    },
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: 75,
        overflow: 'hidden',
        borderColor: 'black',
        borderWidth: 1,
        marginRight: 5,
    },
    leftContainer: {
        alignItems: 'flex-start',
        width: "20%",
        backgroundColor: "white",
    },
    centerContainer: {
        alignItems: 'flex-start',
        paddingLeft: 10,
        width: "60%",
        backgroundColor: "white"
    },
    rightContainer: {
        alignItems: 'flex-end',
        width: "20%",
        backgroundColor: "white",
        justifyContent: "center",
        paddingRight: 5
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textAddress: {
        color: 'gray',
        fontSize: 15,
    },
    textDescription: {
        color: 'black',
        fontSize: 15,
        paddingTop: 3
    },
    switch: {
        width: 60,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#CCCCCC',
        position: 'relative',
    },
    switchOn: {
        backgroundColor: '#0f1035',
    },
    switchOff: {
        opacity: 0.5,
    },
    ball: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'white',
        position: 'absolute',
        top: 2,
    },
});

export default ShowProperty;