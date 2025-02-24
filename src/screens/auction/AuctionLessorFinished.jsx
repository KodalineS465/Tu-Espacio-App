import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { supabase } from '../../../supabase';
import { useFocusEffect } from "@react-navigation/native";
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
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user?.user) {
                console.error('Error obteniendo usuario2: ', userError);
                return;
            }

            const { data: propertiesList, error: propertiesError } = await supabase
                .from('Properties')
                .select('*')
                .eq('user', user.user.id)
                .lte('expiresAt', new Date().toISOString())
                .order('expiresAt', { ascending: false })
                .order('createdAt', { ascending: false });

            if (propertiesError) throw propertiesError;

            // Obtener la suabsta más reciente para cada propiedad

            for (const property of propertiesList) {
                const { data: latestAuction, error: auctionError } = await supabase
                    .from('Auctions')
                    .select('*')
                    .eq('property_id', property.id)
                    .eq('isDead', false)
                    .order('createdAt', { ascending: false })
                    limit(1)
                    .single();

                if (!auctionError) {
                    property.latestAuction = latestAuction;

                    // Agregar información de usuario a las ofertas
                    if (latestAuction?.offers?.length > 0) {
                            for (let offer of latestAuction.offers){
                            const { data: userData, error: userError } = await supabase
                                .from('Users')
                                .select('*')
                                .eq('id', offer.id)
                                .single();
                            if (!userError) {
                                offer.user = userData;
                            }
                        }
                    }
                }
            }

            await getImagesUrls(propertiesList);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar las propiedades: ', error);
        }
    };

    const getImagesUrls = async (propertiesList) => {
        for (const item of propertiesList) {
            try {
                const { data, error } = await supabase
                    .storage
                    .from('images')
                    .list(item.id);

                if (error) throw error;

                if (data.length > 0) {
                    const imagePath = data[0].name;
                    const { data: url } = supabase
                        .storage
                        .from('images')
                        .getPublicUrl(`${item.id}/${imagePath}`);

                    item.propertyImage = url.publicUrl;
                } else {
                    item.propertyImage = '';
                }
            } catch (error) {
                console.error('Error al cargar la URL de la imagen: ', error);
            }
        }
        setProperties(propertiesList);
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
                    {properties.map(property => (
                        <ShowFinishedAuction
                            key={property.id}
                            onPress={() => navigation.push("AuctionLessorDetail", { property })}
                            property={property}
                        />
                    ))}
                </ScrollView>
            )}
        </>
    );
};

export default AuctionLessorFinished;