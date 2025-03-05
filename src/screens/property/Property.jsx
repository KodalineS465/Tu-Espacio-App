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
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await getProperties();
        setRefreshing(false);
    };

    const getProperties = async () => {
        try {
            setLoading(true);

            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            const userId = user?.user?.id;
            if (!userId) throw new Error("Usuario no autenticado");

            let { data: propertiesList, error } = await supabase
                .from('Properties')
                .select('*')
                .eq('user', userId)
                .order('createdAt', { ascending: false });

            if (error) throw error;

            // Obtener las últimas subastas asociadas a cada propiedad
            const updatedProperties = await Promise.all(propertiesList.map(async (property) => {
                const { data: auction, error: auctionError} = await supabase
                    .from('Auctions')
                    .select('*')
                    .eq('property_id', property.id)
                    .order('createdAt', { ascending: false})
                    .limit(1)
                    .single();

                return {
                    ...property,
                    latestAuction: auctionError ? null : auction,
                };
            }));

            await getImagesUrls(updatedProperties);
        } catch (error) {
            console.error('Error al cargar las propiedades:', error);
            setLoading(false);
        }
    };
        
    const getImagesUrls = async (propertiesList) => {
        try {
            const updatedProperties = await Promise.all(propertiesList.map(async (item) => {
                try {
                    const { data, error } = await supabase
                        .storage
                        .from('images')
                        .list(item.id, { limit: 1 });

                    if (!error && data.length > 0) {
                        const imageUrl = supabase
                            .storage
                            .from('images')
                            .getPublicUrl(`${item.id}/${data[0].name}`)
                            .publicUrl;
                            
                        return { ...item, propertyImage: imageUrl };
                    }
                } catch (error) {
                    console.error('Error al cargar la URL de la primera imagen:', error);
                }
                return { ...item, propertyImage: '' };  // Si falla, asigna imagen vacía
            }));
            setProperties(updatedProperties);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener las imágenes:', error);
            setLoading(false);
        }
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

            await getProperties();  // ✅ Actualizar la UI
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
        
            await getProperties();  // ✅ Actualizar la UI
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
                                switchValue={ property.expiresAt ? new Date(property.expiresAt) >= new Date() : false }
                            />
                        ))}
                    </ScrollView>
                </>
            )}
        </>
    );
};

export default Property;