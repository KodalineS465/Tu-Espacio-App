import {ActivityIndicator, Modal, Text, TouchableOpacity, View} from "react-native";
import FullShow from "../../components/FullShow";
import storage from "@react-native-firebase/storage";
import React, {useEffect, useState} from "react";
import firestore from "@react-native-firebase/firestore";
import Bid from "../../components/Bid";
import auth from "@react-native-firebase/auth";
import style from "../../components/Styles";


const PropertyDetail = ({ route, navigation }) => {
    const { property } = route.params;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const [currentBid, setCurrentBid] = useState(100300);
    const [tiempoRestante, setTiempoRestante] = useState('');

    useEffect(() => {
        const timestampInicial = property.expiresAt

        const intervalo = setInterval(() => {
            const tiempoActual = firestore.Timestamp.now()

            const diferenciaEnMilisegundos = timestampInicial.toMillis() - tiempoActual.toMillis();

            const segundosTotales = Math.floor(diferenciaEnMilisegundos / 1000);
            const dias = Math.floor(segundosTotales / (24 * 60 * 60));
            const horas = Math.floor((segundosTotales % (24 * 60 * 60)) / (60 * 60));
            const minutos = Math.floor((segundosTotales % (60 * 60)) / 60);

            const tiempoFormateado = `${dias}d ${horas}h ${minutos}m`;

            setTiempoRestante(tiempoFormateado);
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);



    useEffect(() => {
        getImagesUrls()

    }, []);
    const getImagesUrls = async () => {
        try {
            const reference = storage().ref(`images/${property.id}`);
            const listResult = await reference.list();
            property.images = await Promise.all(
                listResult.items.map(async (imageRef) => {
                    return await imageRef.getDownloadURL();
                })
            );
            await getUser()
        } catch (error) {
            console.error('Error getting download URLs:', error);
        }
    };


    const getUser = async () => {
        try {
            setLoading(true);
            const userDoc = await firestore().collection('Users').doc(property.user).get();
            const userData = userDoc.data();
            setUser(userData);
        } catch (error) {
            console.error('Error al cargar las propiedades:', error);
        }
        finally {
            setLoading(false);
        }
    };

    async function agregarOferta(auctionId) {
        try {
            const auctionRef = firestore().collection("Properties").doc(property.id)
                .collection("Auctions").doc(auctionId);
            const offerData = {
                id: auth().currentUser.uid,
                amount: currentBid,
                date: firestore.Timestamp.now()
            };

            await auctionRef.update({
                price: currentBid,
                offers: firestore.FieldValue.arrayUnion(offerData)
            });
            navigation.navigate("Explore")
        } catch (error) {
            console.error("Error al agregar oferta al auction:", error);
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