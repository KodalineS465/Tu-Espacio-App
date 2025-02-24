import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const BlueTitle = ({text}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text} >{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        paddingLeft: 10,
        paddingTop: 10,
        paddingVertical: 10
    },
    text: {
        color: '#0f0135',
        fontSize: 20,
    }
});

export default BlueTitle;
