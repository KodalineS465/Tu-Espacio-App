import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import firestore from "@react-native-firebase/firestore";
const ShowMyActiveAuction = ({ auction, user }) => {
    const [message, setMessage] = useState('');
    const [tiempoRestante, setTiempoRestante] = useState('');

    useEffect(() => {
        const intervalo = setInterval(() => {
            const tiempoActual = firestore.Timestamp.now();
            const diferenciaEnMilisegundos = auction.property.expiresAt.toMillis() - tiempoActual.toMillis();
            const segundosTotales = Math.floor(diferenciaEnMilisegundos / 1000);
            const dias = Math.floor(segundosTotales / (24 * 60 * 60));
            const horas = Math.floor((segundosTotales % (24 * 60 * 60)) / (60 * 60));
            const minutos = Math.floor((segundosTotales % (60 * 60)) / 60);
            const tiempoFormateado = `${dias}d ${horas}h ${minutos}m`;
            setTiempoRestante(tiempoFormateado);
        }, 1000);

        return () => clearInterval(intervalo);
    }, [auction.property.expiresAt]);

    useEffect(() => {
        if (auction.latestOffer && auction.latestOffer.id === user) {
            setMessage("Eres el líder");
        } else {
            setMessage("¡Alguien ofreció más!");
        }
    }, [auction.latestOffer, user]);

    return (
        <View style={styles.container}>
            <View style={styles.imageContainerProperty}>
                <Image
                    source={{ uri: auction.property.propertyImage }}
                    style={[styles.mainImage, styles.rectangularImage]}
                />
            </View>
            <View style={[styles.textContainer, message === '¡Alguien ofreció más!' ? styles.redBackground : null]}>
                <Text style={styles.mainText}>{message}</Text>
            </View>
            <View style={styles.textContainerBasic}>
                <Text style={styles.textAddress} numberOfLines={1}>
                    {auction.property.address}
                </Text>
                <View style={styles.rowContainer}>
                    <Text style={styles.textLastOffer}>Última oferta: </Text>
                    <View style={styles.buttonContainer}>
                        <View style={styles.servicesContainer}>
                            <Text style={styles.textShow}>{auction.latestOffer.amount}</Text>
                        </View>
                    </View>
                    <Text style={styles.textTimeLeft}>Quedan: {tiempoRestante}</Text>
                </View>
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        padding: 10,
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 3,
        paddingTop: 30
    },
    imageContainerProperty: {
        width: "90%",
    },
    mainImage: {
        width: "100%",
    },
    rectangularImage: {
        aspectRatio: 16 / 9,
        width: '100%',
        height: undefined,
        borderColor: 'black',
        borderWidth: 2
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#0f1035',
        width: '90%'
    },
    redBackground: {
        backgroundColor: '#4D0303',
    },
    textContainerBasic: {
        marginBottom: 20,
        width: '90%'
    },
    mainText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    rowContainer: {
        flexDirection: 'row',
    },
    textAddress: {
        color: 'gray',
        fontSize: 16,
    },
    textLastOffer: {
        color: 'black',
        fontSize: 16,
        paddingTop: 5
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
        borderRadius: 3
    },
    textShow: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    textTimeLeft: {
        color: 'black',
        fontSize: 16,
        paddingTop: 5,
        paddingLeft: 10
    },
});

export default ShowMyActiveAuction;
