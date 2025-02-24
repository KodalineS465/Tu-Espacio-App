import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import Navigation from "./src/navigation/Navigation";

export default function App() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Navigation />
        </SafeAreaView>
    );
}
