import React, {useEffect, useState} from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from "@react-native-firebase/auth";
import {useFocusEffect} from "@react-navigation/native";
import ShowMyActiveAuctions from "../../components/ShowMyActiveAuctions";
import ShowFinishedAuction from "../../components/ShowFinishedAuction";
import ShowMyFinishedAuctions from "../../components/ShowMyFinishedAuctions";
const AuctionFinished = ({ navigation }) => {
    const [auctions, setAuctions] = useState([]);
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
                setAuctions([])
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
            const currentTime = firestore.Timestamp.now();
            const propertiesSnapshot = await firestore()
                .collection('Properties')
                .where('expiresAt', '<=', currentTime)
                .get();
            const auctions = [];
            for (const propertyDoc of propertiesSnapshot.docs) {
                const propertyId = propertyDoc.id;
                const propertyData = propertyDoc.data();

                const auctionsSnapshot = await propertyDoc.ref.collection('Auctions')
                    .where("isDead", "==", false)
                    .get();
                let latestAuction;

                auctionsSnapshot.forEach(async (auctionDoc) => {
                    const auctionData = auctionDoc.data();
                    if (!latestAuction || auctionData.createdAt > latestAuction.createdAt) {
                        latestAuction = {
                            id: auctionDoc.id,
                            ...auctionData
                        };

                        const userOffers = latestAuction.offers.filter(offer => offer.id === auth().currentUser.uid);

                        if (userOffers.length > 0) {
                            const latestOffer = latestAuction.offers.sort((a, b) => b.date - a.date)[0];
                            console.log(latestOffer)
                            auctions.push({
                                propertyId: propertyId,
                                property: propertyData,
                                auction: latestAuction,
                                latestOffer: latestOffer
                            });
                        }
                    }
                });
            }
            await getImagesUrls(auctions)
            setLoading(false);

        } catch (error) {
            console.error('Error obteniendo subastas:', error);
            throw error;
        }
    };

    const getImagesUrls = async auctionsList => {
        for (const item of auctionsList) {
            try {
                const reference = storage().ref(`images/${item.propertyId}`);
                const listResult = await reference.list();
                const firstImageRef = listResult.items[0];

                if (firstImageRef) {
                    item.property.propertyImage = await firstImageRef.getDownloadURL();
                } else {
                    item.property.propertyImage = '';
                }
                console.log('URL de la primera imagen cargada correctamente.');
            } catch (error) {
                console.error('Error al cargar la URL de la primera imagen:', error);
            }
        }
        setAuctions(auctionsList);
    };

    return (
        <>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <ScrollView
                    style={{ flex: 1, backgroundColor: 'white'}}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {auctions.map((auction, index) =>(
                            <ShowMyFinishedAuctions
                                key={index}
                                auction={ auction}
                                user = {auth().currentUser.uid}
                                finishedDate={auction.property.expiresAt}
                                navigation={navigation}
                            />
                        ))
                    }
                </ScrollView>
            )}
        </>
    );
};

export default AuctionFinished;