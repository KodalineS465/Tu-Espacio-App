import React, { useRef } from 'react';
import {View, Modal, Button, StyleSheet} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY
const AddressModal = ({ visible, onClose, onPress}) => {
    const GooglePlacesAutocompleteInput = useRef(null);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <GooglePlacesAutocomplete
                        ref={GooglePlacesAutocompleteInput}
                        placeholder='Buscar dirección'
                        fetchDetails={true}
                        onPress={onPress}
                        query={{
                            key: GOOGLE_API_KEY,
                            language: 'es',
                            components: 'country:mx',
                            types: 'address'
                        }}
                        enablePoweredByContainer={false}
                        styles={{
                            container: {
                                width: '100%',
                            },
                        }}
                    />
                    <Button title="Cerrar" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20
    }
})

export default AddressModal;
