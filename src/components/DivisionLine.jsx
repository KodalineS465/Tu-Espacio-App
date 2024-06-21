import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

const DivisionLine = ({ }) => {
    return (
        <View style={styles.container}>
            <View style={styles.linea}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        paddingTop: 1,
        paddingBottom: 1
    },
    linea: {
        borderBottomColor: '#CCCCCC',
        borderBottomWidth: 2,
        width: '100%',
        paddingVertical: 1,
        flex: 1
    }
});

export default DivisionLine;
