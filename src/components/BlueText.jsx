import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const BlueText = ({text, onPress}) => {
    return (
        <View style={styles.container}>
                <Text style={styles.text} onPress={onPress}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        marginLeft: 90,
        marginTop: 10
    },
    text: {
        color: '#0f0135',
        fontWeight: '700',
        fontSize: 17,
        alignItems: 'center'
    }
});

export default BlueText;
