import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from "react-native";
import FullShow from "../../components/FullShow";
import React, {useEffect, useState} from "react";
import { supabase } from '../../../supabase';
import Bid from "../../components/Bid";
import style from "../../components/Styles";


const PropertyDetail = ({ route, navigation }) => {
    const { property } = route.params;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentBid, setCurrentBid] = useState(100300);
    const [tiempoRestante, setTiempoRestante] = useState('');

    useEffect(() => {
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

    useEffect(() => {
        getImagesUrls()
    }, []);

    const getImagesUrls = async () => {
        try {
            const { data, error } = await supabase.storage.from('images').list(property.id);

            if (error) throw error;

            property.images = data.map(image => {
                return supabase.storage.from('images').getPublicUrl(`${property.id}/${image.name}`).publicUrl;
            });

            await getUser()
        } catch (error) {
            console.error('Error getting download URLs:', error);
        }
    };


    const getUser = async () => {
        try {
            setLoading(true);
            const { data: userData, error } = await supabase.from('Users').select('*').eq('id', property.user).single();
            if (error) throw error;

            setUser(userData);
        } catch (error) {
            console.error('Error al cargar las propiedades:', error);
        } finally {
            setLoading(false);
        }
    };

    async function agregarOferta(auctionId) {
        try {
            const { data: user } = await supabase.auth.getUser();
            if (!user?.user) throw new Error("Usuario no autenticado");

            const offerData = {
                id: user.user.id,
                amount: currentBid,
                date: new Date().toISOString()
            };

            const { error } = await supabase.from("Auctions").update({
                price: currentBid,
                offers: [...property.offers, offerData]
            }).eq('id', auctionId);

            if(error) throw error;

            navigation.navigate("Explore");
        } catch (error) {
            console.error("Error al agregar oferta al auction: ", error);
        }
    }
     
    return (
        <>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <View>
                    <Modal
                        animationType="slide"
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <Bid
                            propertyId={property.id}
                            onChangeText={(text) => {
                                setCurrentBid(text)
                            }}
                            createdAt={tiempoRestante}
                            onPress={(text) => {agregarOferta(text)}}
                        />
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={style.confirmButton}
                        >
                            <Text style={style.confirmButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </Modal>
                    <FullShow
                        property={property}
                        user={user}
                        onPress={() => setModalVisible(true)}
                        remainingTime={tiempoRestante}
                    />
                </View>
            )}
        </>
    );
}


export default PropertyDetail;