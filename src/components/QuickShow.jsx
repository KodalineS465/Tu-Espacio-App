import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import Carrousel from "./Carrousel";
import { supabase } from '../../supabase';

const QuickShow = ({ property, onPress }) => {
    const [tiempoRestante, setTiempoRestante] = useState('');

    useEffect(() => {
        if (!property.expiresAt) return;

        const timestampInicial = new Date(property.expiresAt).getTime();

        const intervalo = setInterval(() => {
            const tiempoActual = new Date().getTime();

            const diferenciaEnMilisegundos = timestampInicial - tiempoActual;

            const segundosTotales = Math.floor(diferenciaEnMilisegundos / 1000);
            const dias = Math.floor(segundosTotales / (24 * 60 * 60));
            const horas = Math.floor((segundosTotales % (24 * 60 * 60)) / (60 * 60));
            const minutos = Math.floor((segundosTotales % (60 * 60)) / 60);

            const tiempoFormateado = `${dias}d ${horas}h ${minutos}m`;

            setTiempoRestante(tiempoFormateado);
        }, 1000);

        return () => clearInterval(intervalo);
    }, [property.expiresAt]);

    function formatPrice(price) {
        if (!price) return "0";
        const parts = price.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return parts.join('.');
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <TouchableOpacity onPress={onPress}>
                <View style={styles.container}>
                    <Carrousel images={property.propertyImages} />
                    <View style={styles.containerRow}>
                        <View style={styles.leftContainer}>
                            <Text style={styles.textGray} numberOfLines={1}>{property.address}</Text>
                        </View>
                        <View style={styles.rightContainer}>
                            <Text style={styles.textBlack}>{property.auction.offers.length} ofertas</Text>
                        </View>
                    </View>
                    <View style={styles.containerRow}>
                        <View style={styles.leftContainer}>
                            <Text style={styles.textBlue}>MXN {formatPrice(property.auction.price)}</Text>
                        </View>
                        <View style={styles.rightContainer}>
                            <Text style={styles.textBlack}>{property.expiresAt && tiempoRestante}</Text>
                        </View>
                    </View>
                    <View style={styles.containerRow}>
                        <Image source={require('../assets/bed.png')} style={styles.logo}/>
                        <Text style={styles.textBlack}>{property.rooms}</Text>
                        <Image source={require('../assets/toilet.png')} style={styles.logo}/>
                        <Text style={styles.textBlack}>{property.bathrooms}</Text>
                        <Image source={require('../assets/car.png')} style={styles.logo}/>
                        <Text style={styles.textBlack}>{property.parkingLots}</Text>
                        <Image source={require('../assets/surface.png')} style={styles.logo}/>
                        {property.surfaceUnit === 'Hectáreas' ? (
                            <Text style={styles.textBlack}>{property.surfaceQuantity} ha</Text>
                        ) : (
                            <Text style={styles.textBlack}>{property.surfaceQuantity} m²</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "auto",
        margin: 30,
        backgroundColor: 'white'
    },
    containerRow: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'white',
        paddingHorizontal : 10
    },
    leftContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    textGray: {
        color: 'gray',
        fontSize: 14
    },
    textBlack: {
        color: 'black',
        fontSize: 17
    },
    textBlue: {
        color: '#0f1035',
        fontSize: 18,
        fontWeight: 'bold'
    },
    logo: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15
    }
});

export default QuickShow;