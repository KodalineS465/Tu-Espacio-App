import React, { useState, useContext, useEffect } from 'react';
import { View, RefreshControl, ActivityIndicator, FlatList, Text, Image } from 'react-native';
import QuickShow from "../../components/QuickShow";
import { useFocusEffect } from '@react-navigation/native';
import UserContext from "../../utils/UserProvider";

import { supabase } from '../../../supabase';

const Explore = ({ navigation }) => {
    const { filter, setFilter, orderBy, setOrderBy } = useContext(UserContext);
    const [properties, setProperties] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [lastVisible, setLastVisible] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            // Acciones que deseas ejecutar cuando la pantalla obtiene el enfoque
            console.log('Pantalla enfocada');
            getProperties()
            // Puedes retornar una función de limpieza opcional si es necesario
            return () => {
                console.log('Pantalla desenfocada');
                setProperties([])
                setRefreshing(false)
                setLoading(true)
                setLastVisible(null)
                setLoadingMore(false)
                setModalVisible(false)
            };
        }, [orderBy])
    );

    const onRefresh = async () => {
        console.log('Pantalla desenfocada');
        setProperties([])
        setRefreshing(false)
        setLoading(true)
        setLastVisible(null)
        setLoadingMore(false)
        setModalVisible(false)
        // Acciones que deseas ejecutar cuando la pantalla obtiene el enfoque
        console.log('Pantalla enfocada');
        getProperties()
        // Puedes retornar una función de limpieza opcional si es necesario
    };

    const getProperties = async (isReloading = false) => {
        try {
            let { data: propertiesList, error } = await supabase
                .from('Properties')
                .select(`*, Auctions:Auctions(id, createdAt)`) // Subconsulta para traer Auctions
                .gte('expiresAt', new Date().toISOString())
                .order('expiresAt', { ascending: false })
                .limit(10);
    
            if (error) throw error;
    
            if (propertiesList.length > 0) {
                await getImagesUrls(propertiesList, isReloading);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching properties:', error.message);
        }
    };

                /*if (!auctionsSnapshot.empty) {
                    const auctionDoc = auctionsSnapshot.docs[0];
                    propertyData.auction = {
                        id: auctionDoc.id,
                        ...auctionDoc.data()
                    };
                }
                propertiesList.push(propertyData);
            }

            if (propertiesList.length > 0) {
                setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

                await getImagesUrls(propertiesList, isReloading && true);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };*/

    const getImagesUrls = async (propertiesList, isReloading = false) => {
        for (const item of propertiesList) {
            try {
                const { data, error } = await supabase
                    .storage
                    .from('images')
                    .list(item.id);

                if (error) throw error;

                item.propertyImages = data.map(file =>
                    `${supabase.storage.from('images').getPublicUrl(`${item.id}/${file.name}`).publicURL}`
                );
            } catch (error) {
                console.error('Error getting images:', error.message);
            }
        }

        if (isReloading) {
            setProperties(propertiesList);
        } else {
            setProperties(prevProperties => [...prevProperties, ...propertiesList]);
        }
        setLoading(false);
    };
    
    const renderItem = ({ item }) => {
        // Obtener la marca de tiempo actual
        const currentTime = new Date().getTime();
        console.log("variable iff", item.expiresAt < currentTime)

        // Verificar si el timestamp del item es mayor que el tiempo actual
        if (item.expiresAt < currentTime) {
            return (
                <QuickShow property={item} onPress={() => { navigation.push("ExplorePropertyDetail", { property: item }) }} />
            );
        } else {
            console.log("variable if", item.expiresAt < currentTime)
            // Si el timestamp ha pasado, no mostrar el elemento
            return <View />;
        }
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
                        renderItem={(item) => renderItem(item)}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        onEndReached={async ()=>{
                            setLoadingMore(true)
                            await getProperties();
                            setLoadingMore(false)
                        }}
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