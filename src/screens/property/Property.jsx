 import React, {useEffect, useState} from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import ShowProperty from "../../components/ShowProperty";
import style from "../../components/Styles";

const Property = ({ navigation }) => {
    const [properties, setProperties] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProperties();
        return () => {
            setProperties([])
            setRefreshing(false)
            setLoading(true)
        };
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await getProperties();
        setRefreshing(false);
    };

    const getProperties = async () => {
        try {
            const userInfo = auth().currentUser;
            let query = firestore()
                .collection('Properties')
                .orderBy('createdAt', 'desc')
                .where('user', '==', userInfo.uid);

            const snapshot = await query.get();

            const propertiesList = [];
            for (const documentSnapshot of snapshot.docs) {
                const propertyData = documentSnapshot.data();
                const propertyId = documentSnapshot.id;

                // Get the latest auction for this property
                const auctionSnapshot = await firestore()
                    .collection('Properties')
                    .doc(propertyId)
                    .collection('Auctions')
                    .orderBy('createdAt', 'desc')
                    .limit(1)
                    .get();

                let latestAuction = null;
                if (!auctionSnapshot.empty) {
                    latestAuction = auctionSnapshot.docs[0].data();
                }

                propertiesList.push({
                    id: propertyId,
                    ...propertyData,
                    latestAuction: latestAuction // Add the latest auction to the property data
                });
            }
            await getImagesUrls(propertiesList);
        } catch (error) {
            console.error('Error al cargar las propiedades:', error);
            return [];
        }
    };

    const getImagesUrls = async propertiesList => {
        for (const item of propertiesList) {
            try {
                const reference = storage().ref(`images/${item.id}`);
                const listResult = await reference.list();
                const firstImageRef = listResult.items[0];

                if (firstImageRef) {
                    item.propertyImage = await firstImageRef.getDownloadURL();
                } else {
                    item.propertyImage = '';
                }
            } catch (error) {
                console.error('Error al cargar la URL de la primera imagen:', error);
            }
        }
        setProperties(propertiesList);
        setLoading(false);
    };
    async function AddAuction(propertyId) {
        try {
            // Obtener la referencia a la propiedad
            const propertyRef = firestore().collection("Properties").doc(propertyId);

            // Obtener el valor de "price" de la propiedad
            const propertySnapshot = await propertyRef.get();
            const propertyData = propertySnapshot.data();
            const propertyPrice = propertyData.price;

            // Agregar una subclase "Auctions" con "startingPrice" igual al "price" de la propiedad
            await propertyRef.collection("Auctions").add({
                createdAt: firestore.FieldValue.serverTimestamp(),
                offers: [],
                isDead: false,
                price: propertyPrice,
                startingPrice:propertyPrice
            });

            // Calcular la fecha de expiración (7 días a partir de la fecha actual)
            const currentDate = new Date();
            const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos
            const expirationDate = new Date(currentDate.getTime() + sevenDaysInMilliseconds);
            const expiresAt = firestore.Timestamp.fromDate(expirationDate);

            // Actualizar la propiedad con la fecha de expiración
            await propertyRef.update({ expiresAt });
        } catch (error) {
            console.error("Error al agregar subasta a la propiedad:", error);
        }
    }

    async function DeleteAuction(propertyId) {
        try {
            const propertyRef = firestore().collection("Properties").doc(propertyId);
            const auctionsRef = propertyRef.collection("Auctions");

            const querySnapshot = await auctionsRef
                .orderBy("createdAt", "desc")
                .limit(1)
                .get();

            const batch = firestore().batch();

            querySnapshot.forEach((doc) => {
                batch.update(doc.ref, {
                    isDead: true
                });
            });

            // Actualizar la propiedad para desactivarla
            batch.update(propertyRef, {
                expiresAt: firestore.Timestamp.now()
            });

            // Ejecutar el lote de actualizaciones
            await batch.commit();
        } catch (error) {
            console.error("Error al eliminar subastas activas de la propiedad y desactivarla:", error);
        }
    }

    return (
        <>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <>
                    <ScrollView
                        style={{ flex: 1, backgroundColor: 'white'}}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        <Text style={style.screenTitle}>Propiedades</Text>
                        {properties.map(property => (
                            <ShowProperty
                                key={property.id}
                                onPress={() => navigation.push('EditProperty', { propertyId: property.id })}
                                imageSource={property.propertyImage}
                                textAddress={property.address}
                                textDescription={property.description}
                                onSwitchOn={() => {DeleteAuction(property.id)}}
                                onSwitchOff={() => {AddAuction(property.id)}}
                                switchValue={property.expiresAt >= firestore.Timestamp.now()}
                            />
                        ))}
                    </ScrollView>
                </>
            )}
        </>
    );
};

export default Property;