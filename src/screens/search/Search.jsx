import React, { useEffect, useRef, useState } from "react";
import {ActivityIndicator, Platform, View} from "react-native";
import MapView, {Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE} from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from "@react-navigation/native";

const GOOGLE_API_KEYS = {
    android: process.env.EXPO_PUBLIC_GOOGLE_API_KEY_ANDROID,
    ios: process.env.EXPO_PUBLIC_GOOGLE_API_KEY_IOS
};

const GOOGLE_API_KEY = GOOGLE_API_KEYS[Platform.OS];

const INITIAL_POSITION = {
    latitude: 20.6751707,
    longitude: -103.3473385,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
};

const Search = ({ navigation }) => {
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef(null);

    useFocusEffect(
        React.useCallback(() => {
            getProperties()
            return () => {
                setHouses([])
                setLoading(true)
            };
        }, [])
    );

    const getProperties = async () => {
        try {
            let query = firestore()
                .collection('Properties')
                .where("expiresAt", ">=", firestore.Timestamp.now())
                .orderBy('expiresAt', 'desc')
                .orderBy('createdAt', 'desc');



            const snapshot = await query.get();

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
                setHouses(propertiesList)
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    const onPlaceSelected = (details) => {
        const position = {
            latitude: details?.geometry.location.lat || 0,
            longitude: details?.geometry.location.lng || 0,
        };
        moveTo(position);
    };

    const moveTo = async (position) => {
        const camera = await mapRef.current?.getCamera();
        if (camera) {
            camera.center = position;
            mapRef.current?.animateCamera(camera, { duration: 1000 });
        }
    };

    return (
        <>
            {loading ? (
                <View style={{flex: 1}}>
                    <ActivityIndicator size="large"/>
                </View>
            ) : (
                <View style={{flex: 1}}>
                    <GooglePlacesAutocomplete
                        placeholder="Buscar"
                        fetchDetails={true}
                        onPress={(data, details) => {
                            onPlaceSelected(details);
                        }}
                        query={{
                            key: GOOGLE_API_KEY,
                            language: 'es',
                            components: 'country:mx',
                            types: 'address'
                        }}
                        styles={{
                            container: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                zIndex: 1,
                                width: '100%',
                                alignItems: 'center',
                                padding: 15,
                                paddingHorizontal: 60
                            },
                            textInputContainer: {
                                backgroundColor: 'transparent',
                                borderTopWidth: 0,
                                borderBottomWidth: 0,
                                marginLeft: 10,
                                marginRight: 10,
                                width: '100%',
                                alignItems: 'center'
                            },
                            textInput: {
                                marginLeft: 0,
                                marginRight: 0,
                                height: 38,
                                color: '#5d5d5d',
                                fontSize: 16,
                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb',
                            },
                        }}
                    />
                    <MapView
                        ref={mapRef}
                        provider={Platform.OS === "android"? PROVIDER_GOOGLE: PROVIDER_DEFAULT}
                        style={{flex: 1}}
                        initialRegion={INITIAL_POSITION}
                        showsCompass={true}
                    >
                        {houses.map(house => (
                            <Marker
                                key={house.id}
                                coordinate={{
                                    latitude: house.location.lat,
                                    longitude: house.location.lng
                                }}
                                onPress={() => {navigation.push("SearchPropertyDetail", {property:house})}}
                            />
                        ))}
                    </MapView>
                </View>
            )}
        </>
    );
}

export default Search;
