import React from 'react';
import {StyleSheet, View} from 'react-native';

const SoftLine = () => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.lineContainer}>
                <View style={styles.linea}></View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    lineContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '90%',

    },
    linea: {
        borderBottomColor: '#E6E6E6',
        borderBottomWidth: 2,
        paddingVertical: 10,
        flex: 1
    }
});

export default SoftLine;
