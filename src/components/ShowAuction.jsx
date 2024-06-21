import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import firestore from "@react-native-firebase/firestore";

const ShowAuction = ({ onPress, property }) => {
    const [tiempoRestante, setTiempoRestante] = useState('');
    useEffect(() => {
        // Timestamp inicial
        const timestampInicial = property.expiresAt // Ejemplo de timestamp inicial

        const intervalo = setInterval(() => {
            // Tiempo actual
            const tiempoActual = firestore.Timestamp.now()

            // Calcula la diferencia en milisegundos
            const diferenciaEnMilisegundos = timestampInicial.toMillis() - tiempoActual.toMillis();

            // Convierte la diferencia a días, horas, minutos y segundos
            const segundosTotales = Math.floor(diferenciaEnMilisegundos / 1000);
            const dias = Math.floor(segundosTotales / (24 * 60 * 60));
            const horas = Math.floor((segundosTotales % (24 * 60 * 60)) / (60 * 60));
            const minutos = Math.floor((segundosTotales % (60 * 60)) / 60);

            // Formatea el tiempo restante
            const tiempoFormateado = `${dias}d ${horas}h ${minutos}m`;

            // Actualiza el estado con el tiempo restante formateado
            setTiempoRestante(tiempoFormateado);
        }, 1000);

        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalo);
    }, []);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.leftContainer}>
                <View style={styles.containerImage}>
                    <View style={styles.imageContainerPerson}>
                        <Image
                            source={property.latestAuction && property.latestAuction.offers.length > 0 ? { uri: property.latestAuction.offers[property.latestAuction.offers.length - 1].user.photoURL } : require("../assets/not-image.png")}
                            style={styles.image}
                        />
                    </View>
                    <View style={[styles.imageContainerHouse, { marginLeft: -30 }]}>
                        <Image
                            source={{ uri: property.propertyImage }}
                            style={styles.image}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.centerContainer}>
                <Text style={styles.textAddress} numberOfLines={1}>{property.address}</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.textLeader} numberOfLines={3}> {property.latestAuction && property.latestAuction.offers.length > 0 ? "Postor Lider:" + property.latestAuction.offers[property.latestAuction.offers.length - 1].user.name : ""}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.textLastOffer}>{property.latestAuction && property.latestAuction.offers.length > 0 ? "Ultima oferta: " : "precio inicial: "}</Text>
                    <View style={styles.buttonContainer}>
                        <View style={styles.servicesContainer}>
                            <Text style={styles.textShow}>{property.latestAuction? property.latestAuction.offers.length > 0 ? property.latestAuction.offers[property.latestAuction.offers.length - 1].amount : property.latestAuction.price: property.price}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <Text style={styles.textTimeLeft}>Quedan: </Text>
                <Text style={styles.textTimeLeft}>{tiempoRestante}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    containerImage: {
        flexDirection: 'row',
        padding: 10
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
        width: '45%',
        paddingTop: 25
    },
    rightContainer: {
        backgroundColor: 'white',
        width: '22%',
        paddingTop: 25,
        paddingLeft: 10,
        paddingRight: 5
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
    textAddress: {
        color: 'gray',
        fontSize: 16,
    },
    textLeader: {
        color: 'black',
        fontSize: 16,
    },
    textLastOffer: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    textTimeLeft: {
        color: '#0f1035',
        fontSize: 14,
    },
    textShow: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
});

export default ShowAuction;