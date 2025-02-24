import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import { supabase } from '../../supabase';

const Bid = ({ onChangeText, createdAt, onPress, propertyId }) => {
    const [primerAuction, setPrimerAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState('');

    function formatPrice(price) {
        if (!price) return "";
        const parts = price.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    useEffect(() => {
        const fetchPrimerAuction = async () => {
            try {
                const { data, error } = await supabase
                    .from('Auctions')
                    .select('*')
                    .eq('property_id', propertyId)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error) throw error;

                if(data) {
                    setPrimerAuction(data);
                    setValue(data.price.toString());
                } else {
                    console.log("No se encontraron subastas.");
                }
            } catch (error) {
                console.error("Error al obtener la subasta: ", error);
            }
        };

        fetchPrimerAuction();
    }, [propertyId]);

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