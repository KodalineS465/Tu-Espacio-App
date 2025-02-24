import React, { useRef } from 'react';
import { View, Modal, Button, StyleSheet, TextInput } from 'react-native';
import Mapview, { Marker } from 'react-native-maps';

const AddressModal = ({ visible, onClose, onPress }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [region, setRegion] = useState({
        latitude: 19.4326,
        longitude: -99.1332,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const handleSearchChange = async (text) => {
        setSearchQuery(text);

        if (text.length < 3) return; // Evita buscar con menos de 3 cáracteres

        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
                params: {
                    q: text,
                    format: 'json',
                    addressdetails: 1,
                    limit: 1, // Solo tomamos el primer resultado
                },
            });

            if (response.data.length > 0) {
                const location = response.data[0];

                setRegion({
                    latitude: parseFloat(location.lat),
                    longitude: parseFloat(location.lon),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });

                console.log('Ubicación encontrada: ', location.display_name);
            } else {
                console.log('No se encontraron resultados.');
            }
        } catch (error) {
            console.error('Error en la búsqueda: ', error);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <TextInput
                        style={styles.input}
                        placeholder="Buscar dirección"
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                    />

                    <MapView style={styles.map} region={region}>
                        <Marker coordinate={region} />
                    </MapView>

                    <Button title="Cerrar" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
  container: {
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
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingLeft: 10,
  },
  map: {
    width: '100%',
    height: '70%',
    marginBottom: 20,
  },
});

export default AddressModal;