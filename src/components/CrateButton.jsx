import React from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';

const CreateButton = ({onPress}) => {
    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.rightContainer}>
                <TouchableOpacity  onPress={onPress}>
                    <Image
                        source={require('../assets/create.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
    },
    rightContainer: {
        alignItems: 'flex-end',
    },
    logo: {
        width: 65,
        height: 65,
        marginLeft: 20
    },
    image: {
        width: 30,
        height: 30,
        marginRight: 5
    }
});


export default CreateButton;