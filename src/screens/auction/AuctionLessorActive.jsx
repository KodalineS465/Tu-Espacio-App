import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text } from 'react-native';
import { supabase } from '../../../supabase';
import style from "../../components/Styles";
import ShowAuction from "../../components/ShowAuction";
import { useFocusEffect } from "@react-navigation/native";

const AuctionLessorActive = ({ navigation }) => {
    const [properties, setProperties] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            console.log('Pantalla enfocada');
            setLoading(true);
            getAllAuctions();
            return () => {
                console.log('Pantalla desenfocada');
                setProperties([]);
                setRefreshing(false);
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
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData?.user) return;

            const user = userData.user;
            if (!user) return;

            let { data: propertiesList, error } = await supabase
                .from('Properties')
                .select('*')
                .eq('user', user.id)
                .gte('expiresAt', new Date().toISOString())
                .order('expiresAt', { ascending: false })
                .order('createdAt', { ascending: false });

            if (error) throw error;

            if (propertiesList.length > 0) {
                // Obtener auctions en una sola consulta
                const propertyIds = propertiesList.map(p => p.id);
                const { data: auctions, error: auctionError } = await supabase
                    .from('Auctions')
                    .select('*')
                    .in('property_id', propertyIds)
                    .order('createdAt', { ascending: false });
                
                if (auctionError) throw auctionError;

            // Asignar la última subasta a cada propiedad
            propertiesList.forEach(property => {
                property.latestAuction = auctions.find(a => a.property_id === property.id) || null;
            });

            await getImagesUrls(propertiesList);
            console.log('Propiedades cargadas correctamente');
        } else {
            setProperties([]);
            setLoading(false);
        }
    } catch (error) {
        console.error('Error al cargar las propiedades:', error);
    }
};

    const getImagesUrls = async (propertiesList) => {
        try {
            for (const item of propertiesList) {
                const { data } = supabase.storage
                    .from('images')
                    .getPublicUrl(`${item.id}.jpg`);
                
                if (error) throw error;
                item.propertyImage = data.publicUrl || '';
                console.log('URL de la imagen cargada correctamente.');
            }
            
            setProperties(propertiesList);
        } catch (error) {
            console.error('Error al cargar la URL de la imagen:', error);
        } finally {
            setLoading(false);
        }
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
                    {properties.length > 0 ? (
                        properties.map(property => (
                            <ShowAuction
                                key={property.id}
                                onPress={() => {}}
                                property={property}
                            />
                        ))
                    ) : (
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay propiedades disponibles</Text>
                    )}
                </ScrollView>
            )}
        </>
    );
};

export default AuctionLessorActive;