import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import firestore from "@react-native-firebase/firestore";

const Bid = ({ onChangeText, createdAt, onPress, propertyId }) => {
    const [primerAuction, setPrimerAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState('');

    function formatPrice(price) {
        const parts = price.toString().split('.');

        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return parts.join('.');
    }

    useEffect(() => {
        const usePrimerAuction = async () => {
            try {
                const propertyRef = firestore().collection("Properties").doc(propertyId);
                const auctionsSnapshot = await propertyRef.collection("Auctions")
                    .orderBy("createdAt", "desc")
                    .limit(1)
                    .get();

                if (!auctionsSnapshot.empty) {
                    const primerAuctionDoc = auctionsSnapshot.docs[0];
                    const primerAuctionData = {
                        id: primerAuctionDoc.id,
                        ...primerAuctionDoc.data()
                    };
                    setPrimerAuction(primerAuctionData);
                    setValue(primerAuctionData.price.toString());
                } else {
                    console.log("No se encontraron subclases Auctions para esta clase Properties.");
                }
            } catch (error) {
                console.error("Error al obtener el primer auction:", error);
            }
        };
        usePrimerAuction()
    }, []);

    useEffect(() => {
        if (primerAuction) {
            setValue(primerAuction.price.toString());
        }
    }, [primerAuction]);

    const handleInputChange = (text) => {
        setValue(text.replace(/\D/g, ''));
        onChangeText(text.replace(/\D/g, ''))
    };

    const handleConfirmOffer = () => {
        const newOffer = parseInt(value);
        console.log(newOffer, primerAuction?.price,!isNaN(newOffer)? "true":"false")
        if (!isNaN(newOffer) && newOffer >= (primerAuction?.price || 0)) {
            onChangeText(newOffer)
            onPress(primerAuction.id)
        } else {
            alert('La oferta debe ser mayor a la actual.');
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.largeText}>Realizar Oferta</Text>
                <Text style={styles.smallText}>Última oferta: ${formatPrice(primerAuction ? primerAuction.price : "")}</Text>
                <Text style={styles.mediumText}>Tiempo restante {createdAt}</Text>
            </View>
            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={() => {}}>
                    <TextInput
                        value={`$${formatPrice(value)}`}
                        onChangeText={handleInputChange}
                        placeholder="Haz tu oferta"
                        keyboardType="numeric"
                        style={styles.input}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirmOffer} style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>Confirmar oferta</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 30
    },
    textContainer: {
        marginBottom: 20,
    },
    largeText: {
        fontSize: 28,
        color: '#0f1035',
        fontWeight: 'bold',
    },
    mediumText: {
        fontSize: 20,
        color: '#0f1035',
    },
    smallText: {
        fontSize: 18,
        color: 'gray',
    },
    inputContainer: {
        alignItems: 'center',
        marginTop: 50,
        justifyContent: "center"
    },
    input: {
        textAlign: 'center',
        height: "auto",
        width: '50%',
        fontSize: 40,
        color: "#0f1035",
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 10,
    },
    confirmButton: {
        marginTop: 30,
        backgroundColor: '#0f1035',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Bid;