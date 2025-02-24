import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View, Image} from 'react-native';

const LessorButton = ({onPress}) => {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.lineContainer}>
                <View style={styles.linea}></View>
            </View>
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <View style={styles.row}>
                    <Text style={styles.textUp}>Publica Tu Espacio</Text>
                    <View style={styles.imageContainer}>
                        <Image source={require('../assets/shine-house.png')} style={styles.image} />
                    </View>
                </View>
                <Text style={styles.textDown}>Publica un anuncio, subasta tu espacio y
                    empieza a tener ingresos, es muy sencillo.</Text>
            </TouchableOpacity>
            <View style={styles.lineContainer}>
                <View style={styles.linea}></View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#dcf2f1',
        borderRadius: 10,
        width: '80%'
    },
    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20
    },
    imageContainer:{
        alignSelf: 'flex-end',
        marginRight: 35,
        marginBottom: 0,
        marginTop: 15
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'space-between'
    },
    textUp: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15,
        marginTop:15
    },
    textDown: {
        fontSize: 16,
        marginLeft: 10,
        marginBottom: 10
    },
    image: {
        width: 40,
        height: 40,
        marginLeft: 10
    },
    lineContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        flexDirection: 'row',
        marginTop: 3,
        marginBottom: 20

    },
    linea: {
        borderBottomColor: '#E6E6E6',
        borderBottomWidth: 2,
        width: '100%',
        paddingVertical: 10,
        flex: 1
    }
});

export default LessorButton;