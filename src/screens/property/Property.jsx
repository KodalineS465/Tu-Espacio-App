import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text } from 'react-native';
import { supabase } from '../../../supabase';
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
            const { data: user } = await supabase.auth.getUser();
            const userId = user?.user?.id;

            if (!userId) throw new Error("Usuario no autenticado");

            let { data: propertiesList, error } = await supabase
                .from('Properties')
                .select('*')
                .eq('user', userId)
                .order('createdAt', { ascending: false });

            if (error) throw error;

            for (const property of propertiesList) {
                let { data: auction, error: auctionError } = await supabase
                    .from('Auctions')
                    .select('*')
                    .eq('property_id', property.id)
                    .order('createdAt', { ascending: false })
                    .limit(1)
                    .single();

                if (!auctionError) {
                    property.latestAuction = auction;
                }
            }

            await getImagesUrls(propertiesList);
        } catch (error) {
            console.error('Error al cargar las propiedades: ', error);
            setLoading(false);
        }
    };

    const getImagesUrls = async (propertiesList) => {
        for (const item of propertiesList) {
            try {
                const { data, error } = await supabase
                    .storage
                    .from('images')
                    .list(item.id, { limit: 1 });

                if (!error && data.length > 0) {
                    const { data: imageUrl } = supabase
                        .storage
                        .from('images')
                        .getPublicUrl(`${item.id}/${data[0].name}`);
                    item.propertyImage = imageUrl.publicUrl;
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
            const { data: property, error } = await supabase
                .from('Properties')
                .select('price')
                .eq('id', propertyId)
                .single();

            if (error) throw error;

            const startingPrice = property.price;
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 7);

            await supabase.from('Auctions').insert([
                {
                    property_id: propertyId,
                    createdAt: new Date().toISOString(),
                    offers: [],
                    isDead: false,
                    price: startingPrice,
                    startingPrice: startingPrice,
                    expiresAt: expirationDate.toISOString()
                }
            ]);
        } catch (error) {
            console.error("Error al agregar subasta a la propiedad:", error);
        }
    }

    async function DeleteAuction(propertyId) {
        try {
            const { data: latestAuction, error } = await supabase
                .from('Auctions')
                .select('id')
                .eq('property_id', propertyId)
                .order('createdAt', { ascending: false })
                .limit(1)
                .single();

            if (error || !latestAuction) return;

            await supabase.from('Auctions').update({ isDead: true }).eq('id', latestAuction.id);
            await supabase.from('Properties').update({ expiresAt: new Date().toISOString() }).eq('id', propertyId);
        } catch (error) {
            console.error('Error al eliminar subasta: ', error);
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
                                onSwitchOn={() => DeleteAuction(property.id)}
                                onSwitchOff={() => AddAuction(property.id)}
                                switchValue={new Date(property.expiresAt) >= new Date()}
                            />
                        ))}
                    </ScrollView>
                </>
            )}
        </>
    );
};

export default Property;