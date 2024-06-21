import React, {useEffect, useState} from 'react';
import {ActivityIndicator, RefreshControl, ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from "@react-native-firebase/auth";
import {useFocusEffect} from "@react-navigation/native";
import ShowFinishedAuction from "../../components/ShowFinishedAuction";
const AuctionLessorFinished = ({ navigation }) => {
    const [properties, setProperties] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            // Acciones que deseas ejecutar cuando la pantalla obtiene el enfoque
            console.log('Pantalla enfocada');
            getAllAuctions();
            // Puedes retornar una función de limpieza opcional si es necesario
            return () => {
                console.log('Pantalla desenfocada');
                setProperties([])
                setRefreshing(false)
                setLoading(true)
            };
        }, [])
    );
    const onRefresh = async () => {
        setRefreshing(true);
        await getAllAuctions();
        setRefreshing(false);
    };

    const getAllAuctions = async () => {
        try {
            const userInfo = auth().currentUser;
            let query = firestore()
                .collection('Properties')
                .where('user', '==', userInfo.uid)
                .where("expiresAt", "<=", firestore.Timestamp.now())
                .orderBy('expiresAt', 'desc')
                .orderBy('createdAt', 'desc');

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
                    .where("isDead", "==", false)
                    .orderBy('createdAt', 'desc')
                    .limit(1)
                    .get();

                let latestAuction = null;
                if (!auctionSnapshot.empty) {
                    latestAuction = auctionSnapshot.docs[0].data();
                    // Add user info to each offer
                    if (latestAuction.offers && latestAuction.offers.length > 0) {
                        for (let offer of latestAuction.offers) {
                            const userDoc = await firestore().collection('Users').doc(offer.id).get();
                            const userData = userDoc.data();
                            offer.user = userData; // Replace userId with user data
                        }
                    }
                }

                propertiesList.push({
                    id: propertyId,
                    ...propertyData,
                    latestAuction: latestAuction // Add the latest auction to the property data
                });
            }
            await getImagesUrls(propertiesList);
            setLoading(false);
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
                console.log('URL de la primera imagen cargada correctamente.');
            } catch (error) {
                console.error('Error al cargar la URL de la primera imagen:', error);
            }
        }
        setProperties(propertiesList);
    };


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
                        {properties.map(property => (
                            <ShowFinishedAuction
                                key={property.id} // Suponiendo que cada propiedad tiene un ID único
                                onPress={() => {navigation.push("AuctionLessorDetail", {property: property})}}
                                property={property}
                            />
                        ))}
                    </ScrollView>
                </>
            )}
        </>
    );
};

export default AuctionLessorFinished;