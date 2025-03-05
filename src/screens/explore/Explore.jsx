import React, { useState, useContext } from 'react';
import { View, RefreshControl, ActivityIndicator, FlatList } from 'react-native';
import QuickShow from "../../components/QuickShow";
import { useFocusEffect } from '@react-navigation/native';
import UserContext from "../../utils/UserProvider";

import { supabase } from '../../../supabase';


// Muestra una lista de propiedades obtenidas desde Supabase con soporte de paginación y actualización.
const Explore = ({ navigation }) => {
    const { orderBy } = useContext(UserContext);
    const [properties, setProperties] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);

    // Maneja el efecto de enfoque en la pantalla para recargar las propiedades
    useFocusEffect(
        React.useCallback(() => {
            // Acciones que deseas ejecutar cuando la pantalla obtiene el enfoque
            console.log('Pantalla enfocada');
            fetchProperties(true);
            // Puedes retornar una función de limpieza opcional si es necesario
            return () => {
                console.log('Pantalla desenfocada');
                resetState();
            };
        }, [orderBy])
    );

    // Función para resetear el estado del componente.
    const resetState = () => {
        setProperties([]);
        setRefreshing(false);
        setLoading(true);
        setLoadingMore(false);
        setOffset(0);
    };

    // Función para manejar la actualización de la lista al realizar pull-to-refresh.
    const onRefresh = async () => {
        resetState();
        fetchProperties(true);
    };

    // Obtiene las propiedades desde Supabase con soporte de paginación. @param {boolean} reset - Indica si se debe reiniciar la lista.
    const fetchProperties = async (reset = false) => {
        if (loading || loadingMore) return;

        try {
            if (reset) {
                setLoading(true);
                setOffset(0);
            } else {
                setLoadingMore(true);
            }

            let { data: propertiesList, error } = await supabase
                .from('Properties')
                .select(`*, Auctions:Auctions(id, createdAt)`) // Subconsulta para traer Auctions
                .gte('expiresAt', new Date().toISOString())
                .order('expiresAt', { ascending: false })
                .range(reset ? 0 : offset, reset ? 9 : offset + 9); // Paginación
    
            if (error) throw error;
    
            if (propertiesList.length > 0) {
                await getImagesUrls(propertiesList);
                setProperties(prev => [...prev, ...propertiesList]);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching properties:', error.message);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Obtiene las imágenes de las propiedades desde Supabase Storage.
    const getImagesUrls = async (propertiesList) => {
        try {
            const imagesData = await Promise.all(propertiesList.map(async (item) => {
                const { data, error } = await supabase.storage.from('images').list(`${item.id}/`);
                if (error) throw error;

                return {
                    ...item,
                    propertyImages: data.map(file =>
                        supabase.storage.from('images').getPublicUrl(`${item.id}/${file.name}`).publicURL
                    )
                };
            }));

            setProperties(prev => [...prev, ...imagesData]);
        } catch (error) {
            console.error('Error getting images:', error.message);
        }
    };

    // Renderiza cada elemento de la lista.
    const renderItem = ({ item }) => {
        // Obtener la marca de tiempo actual
        const currentTime = new Date().getTime();
        // Verificar si el timestamp del item es mayor que el tiempo actual
        if (new Date(item.expiresAt).getTime() >= Date.now()) {
            return <QuickShow property={item} onPress={() => navigation.push("ExplorePropertyDetail", { property: item }) } />;
        } 
        return null;
    };


    return (
        <>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <>
                    <FlatList
                        style={{ flex: 1, backgroundColor: '#0f1035' }}
                        data={properties}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        onEndReached={() => { if (!loadingMore) fetchProperties(false); }}
                        onEndReachedThreshold={0.1}
                        scrollEventThrottle={16}
                        scrollEnabled={!loadingMore && !refreshing}
                        ListFooterComponent={() => (
                            <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                                {loadingMore && <ActivityIndicator size="large" />}
                            </View>
                        )}
                    />
                </>
            )}
        </>
    );
};


export default Explore;