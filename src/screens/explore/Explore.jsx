import React, {useState, useContext} from 'react';
import {
    View,
    RefreshControl,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import QuickShow from "../../components/QuickShow";
import { useFocusEffect } from '@react-navigation/native';
import UserContext from "../../utils/UserProvider";
const Explore = ({navigation}) => {
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
            let query = firestore().collection('Properties')
                .where("expiresAt", ">=", firestore.Timestamp.now())
                .orderBy(`expiresAt`, "desc")

            if (lastVisible && !isReloading) {
                query = query.startAfter(lastVisible);
            }

            const snapshot = await query.limit(10).get();
            const propertiesList = [];

            for (const documentSnapshot of snapshot.docs) {
                const propertyData = {
                    id: documentSnapshot.id,
                    ...documentSnapshot.data()
                };
                const auctionsSnapshot = await firestore()
                    .collection('Properties')
                    .doc(documentSnapshot.id)
                    .collection('Auctions')
                    .orderBy('createdAt', 'desc')
                    .limit(1)
                    .get();

                if (!auctionsSnapshot.empty) {
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
    };
    const getImagesUrls = async (propertiesList, isReloading = false) => {
        for (const item of propertiesList) {
            try {
                const reference = storage().ref(`images/${item.id}`);
                const listResult = await reference.list();
                item.propertyImages = await Promise.all(
                    listResult.items.map(async (imageRef) => {
                        return await imageRef.getDownloadURL();
                    })
                );
            } catch (error) {
                console.error('Error getting download URLs:', error);
            }
        }
        if (isReloading){
            setProperties(propertiesList)
        }
        else {
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