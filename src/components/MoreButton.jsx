import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';

const MoreButton = ({ img, onPress, text }) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <View style={styles.content}>
                    <Image
                        source={img}
                        style={styles.iconLeft}
                    />
                    <Text style={styles.text}>{text}</Text>
                </View>
                <Image
                    source={require('../assets/right.png')}
                    style={styles.iconRight}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 0
    },
    button: {
        backgroundColor: 'white',
        width: '100%',
        padding: 15,
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 1.5,
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        color: 'black',
        fontSize: 19,
        alignItems: 'center',
        marginLeft: 10
    },
    iconLeft: {
        width: 25,
        height: 25
    },
    iconRight: {
        width: 15,
        height: 15,
        marginLeft: 'auto'
    },
});

export default MoreButton;
