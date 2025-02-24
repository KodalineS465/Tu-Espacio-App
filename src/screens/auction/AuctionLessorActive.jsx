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
            getAllAuctions();
            return () => {
                console.log('Pantalla desenfocada');
                setProperties([]);
                setRefreshing(false);
                setLoading(true);
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
            const user = supabase.auth.user();
            if (!user) return;

            let { data: propertiesList, error } = await supabase
                .from('Properties')
                .select('*')
                .eq('user', user.id)
                .gte('expiresAt', new Date().toISOString())
                .order('expiresAt', { ascending: false })
                .order('createdAt', { ascending: false });

            if (error) throw error;

            for (const property of propertiesList) {
                let { data: auctions, error: auctionError } = await supabase
                    .from('Auctions')
                    .select('*')
                    .eq('property_id', property.id)
                    .order('createdAt', { ascending: false })
                    .limit(1);
                
                if (auctionError) throw auctionError;
                property.latestAuction = auctions.length ? auctions[0] : null;
            }
            
            await getImagesUrls(propertiesList);
            console.log('Propiedades cargadas correctamente');
        } catch (error) {
            console.error('Error al cargar las propiedades:', error);
        }
    };

    const getImagesUrls = async (propertiesList) => {
        for (const item of propertiesList) {
            try {
                const { data, error } = await supabase.storage
                    .from('images')
                    .getPublicUrl(`${item.id}.jpg`);
                
                if (error) throw error;
                item.propertyImage = data.publicUrl || '';
                console.log('URL de la imagen cargada correctamente.');
            } catch (error) {
                console.error('Error al cargar la URL de la imagen:', error);
            }
        }
        setProperties(propertiesList);
        setLoading(false);
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
                        <ShowAuction
                            key={property.id}
                            onPress={() => {}}
                            property={property}
                        />
                    ))}
                </ScrollView>
            )}
        </>
    );
};

export default AuctionLessorActive;
