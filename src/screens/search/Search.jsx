import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View, TextInput, FlatList, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import { supabase } from '../../../supabase';
import { useFocusEffect } from "@react-navigation/native";

const INITIAL_POSITION = {
    latitude: 20.6751707,
    longitude: -103.3473385,
};

const Search = ({ navigation }) => {
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

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
            const { data: properties, error } = await supabase
                .from('Properties')
                .select("*, Auctions(*), location:location(lat, lng)")
                .gte("expiresAt", new Date().toISOString())
                .order("expiresAt", { ascending: false })
                .order("createdAt", { ascending: false });

            if (error) throw error;

            setHouses(properties || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching properties: ', error);
            setLoading(false);
        }
    };

    const searchPlaces = async (text) => {
        setQuery(text);
        if (text.length > 2) {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${text}`);
                setResults(response.data);
            } catch (error) {
                console.error("Error en búsqueda: ", error);
            }
        } else {
            setResults([]);
        }
    };

    const onPlaceSelected = (place) => {
        const position = {
            latitude: parseFloat(place.lat),
            longitude: parseFloat(place.lon),
        };
        setQuery(place.display_name);
        setResults([]);
        sendMessageToWebView(position);
    };

    const webViewRef = useRef(null);

    const sendMessageToWebView = (position) => {
        webViewRef.current?.injectJavaScript(`
            map.setView([${position.latitude}, ${position.longitude}], 15);
            L.marker([${position.latitude}, ${position.longitude}]).addTo(map);
        `);
    };

    const mapHtml = `
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        </head>
        <body>
            <div id="map" style="width: 100vw; height: 100vh;"></div>
            <script>
                var map = L.map('map').setView([${INITIAL_POSITION.latitude}, ${INITIAL_POSITION.longitude}], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);
                
                window.addEventListener('message', (event) => {
                    var data = JSON.parse(event.data);
                    map.setView([data.latitude, data.longitude], 15);
                    L.marker([data.latitude, data.longitude]).addTo(map);
                });
            </script>
        </body>
        </html>
    `;


    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 10, backgroundColor: "white" }}>
                <TextInput
                    placeholder="Buscar dirección..."
                    value={query}
                    onChangeText={searchPlaces}
                    style={{ height: 40, borderBottomWidth: 1, padding: 8 }}
                />
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.place_id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => onPlaceSelected(item)}>
                            <Text>{item.display_name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <WebView
                    ref={webViewRef}
                    originWhitelist={["*"]}
                    source={{ html: mapHtml }}
                    style={{ flex: 1 }}
                />
            )}
        </View>
    );
};

export default Search;