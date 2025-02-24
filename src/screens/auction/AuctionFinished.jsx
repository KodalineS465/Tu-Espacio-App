import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text } from 'react-native';
import { supabase } from '../../../supabase';
import ShowMyFinishedAuctions from '../../components/ShowMyFinishedAuctions';

const AuctionFinished = ({ navigation }) => {
    const [autions, setAuctions] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllAuctions();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await getAllAuctions()
        setRefreshing(false);
    };

    const getAllAuctions = async () => {
        try {
            const currentTime = new Date().toISOString();
            const user = await supabase.auth.getUser();
            if (!user?.data?.user) {
                console.error("Usuario no autenticado");
                return;
            }

            // Obtener todas las propiedades cuyo `expiresAt` ya pasó
            let { data: properties, error } = await supabase
                .from('Properties')
                .select('*')
                .lte('expiresAt', currentTime);

            if (error) throw error;

            const auctionsList = [];

            for (const property of properties) {
                //Obtener la suabsta más reciente de la propiedad
                let { data: auctionsData, error: auctionsError } = await supabase
                    .from('Auctions')
                    .select('*')
                    .eq('propertyId', property.id)
                    .eq('isDead', false)
                    .order('createdAt', { ascending: false })
                    .limit(1);

                if (auctionsError) throw auctionsError;

                if (auctions.length > 0) {
                    const latestAuction = auctionsData[0];

                    // Filtrar las ofertas del usuario actual
                    const userOffers = latestAuction.offers.filter(offer => offer.id === user.data.user.id);
                    
                    if (userOffers.length > 0) {
                        constLatestOffer = userOffers.sort((a, b) => b.date - a.date)[0];

                        auctionsList.push({
                            propertyId: property.id,
                            property,
                            auction: latestAuction,
                            latestOffer,
                        });
                    }
                }
            }

            // Obtener imágenes desde supabase 
            await getImagesUrls(auctions);
            setLoading(false);

        } catch (error) {
            console.error('Error obteniendo subastas: ', error);
        }
    };

    const getImagesUrls = async (auctionsList) => {
        for (const item of auctionsList) {
            try {
                const { data } = supabase.storage.from('images').getPublicUrl(item.propertyId);
                item.property.propertyImage = data.publicUrl || '';
            } catch (error) {
                console.error('Error al cargarla URL de la imagen: ', error);
                item.property.propertyImage = '';
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
                    style={{ flex: 1, backgroundColor: 'white' }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {auctions.map((auction, index) => (
                        <ShowMyFinishedAuctions
                            key={index}
                            auction={auction}
                            user={supabase.auth.getUser().data?.user?.id}
                            finishedDate={auction.property. expireAt}
                            navigation={navigation}
                        />
                    ))}
                </ScrollView>
            )}
        
        </>
    );
};

export default AuctionFinished;