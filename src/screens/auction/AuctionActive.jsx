import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { supabase } from '../../../supabase'; // Archivo de configuración de Supabase
import style from "../../components/Styles";
import { useFocusEffect } from "@react-navigation/native";
import ShowMyActiveAuctions from "../../components/ShowMyActiveAuctions";

const AuctionActive = ({ navigation }) => {
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
            const currentTime = new Date().toISOString();
            const { data: propertiesList, error } = await supabase
                .from('Properties')
                .select(`*, Auctions:Auctions(id, createdAt, isDead, offers)`)
                .gte('expiresAt', currentTime);

            if (error) throw error;

            const filteredAuctions = propertiesList.flatMap(property => {
                const latestAuction = property.Auctions
                    .filter(auction => !auction.isDead)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a. createdAt))[0];

                if (latestAuction) {
                    const userOffers = latestAuction.offers.filter(offer => offer.id === supabase.auth.user()?.id);
                    if (userOffers.length > 0) {
                        const latestOffer = userOffers.sort ((a, b) => new Date(b.date) - new Date(a.date))[0];
                        return [{
                            propertyId: property.id,
                            property,
                            auction: latestAuction,
                            latestOffer
                        }];
                    }
                }
                return [];
            });

            await getImagesUrls(filteredAuctions);
            setLoading(false);
        } catch (error) {
            console.error('Error obteniendo subastas: ', error);
        }
    };


    const getImagesUrls = async auctionsList => {
        for (const item of auctionsList) {
            try {
                const { data, error } = await supabase
                    .storage
                    .from('images')
                    .list(item.propertyId);

                if (error) throw error;
                item.property.propertyImage = data.length > 0
                    ? supabase.storage.from('images').getPublicUrl(`${item.propertyId}/${data[0].name}`).publicURL
                    : '';
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
                     {auctions.map((auction, index) => (
                        <ShowMyActiveAuctions
                            key={index}
                            auction={auction}
                            user={supabase.auth.user()?.id}
                        />
                    ))}
                </ScrollView>
            )}
        </>
    );
};

export default AuctionActive;
