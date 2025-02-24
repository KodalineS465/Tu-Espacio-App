import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, Alert, ActivityIndicator, Modal, TouchableOpacity, Text } from 'react-native';
import { supabase } from '../../../supabase';
import { manipulateAsync, SaveFormat} from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import style from "../../components/Styles";
import ShowAddress from "../../components/ShowAddress";
import BlueButton from "../../components/BlueButton";
import OptionsButton from "../../components/OptionsButton";
import TallInput from "../../components/TallInput";
import RoundButtons from "../../components/RoundButtons";
import SurfaceInput from "../../components/SurfaceInput";
import AvailabilityInput from "../../components/AvailabilityInput";
import MultiButton from "../../components/MultiButton";
import PriceInput from "../../components/PriceInput";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const EditProperty = ({ route }) => {
    const { propertyId } = route.params;
    const [fullAddress, setFullAddress] = useState('');
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState({"lat": null, "lng": null});
    const [price, setPrice] = useState('');
    const [rooms, setRooms] = useState(null);
    const [bathrooms, setBathrooms] = useState(null);
    const [parkingLots, setParkingLots] = useState(null);
    const [availability, setAvailability] = useState({ date: null, now: false });
    const [type, setType] = useState(null);
    const [description, setDescription] = useState('');
    const [surfaceType, setSurfaceType] = useState('');
    const [surfaceUnit, setSurfaceUnit] = useState('');
    const [surfaceQuantity, setSurfaceQuantity] = useState('');
    const [oldness, setOldness] = useState(null);
    const [services, setServices] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [images, setImages] = useState([]);
    const [imageNames, setImageNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUpLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const GooglePlacesAutocompleteInput = useRef();
    const optionsType = ['Casa', 'Duplex', 'Casa en condominio', 'Departamento compartido', 'Departamento',
        'Local en centro comercial', 'Local comercial','Bodega comercial', 'Oficina', 'Edificio', 'Otro'];
    const optionsOldness = ['A estrenar', '1 año', '2 años', '3 años', '4 años', 'De 5 a 10 años', 'De 10 a 20 años',
        'De 20 a 30 años', 'De 30 a 40 años', 'Mas de 50 años'];
    const optionsServices = ['Aire acondicionado', 'Agua', 'Cable', 'Conmutador', 'Internet', 'Gas',
        'Seguridad privada', 'Ningun servicio incluido'];
    const optionsAmenities = ['Area de picnic', 'Areas de juegos infantiles', 'Area para mascotas', 'Asensores',
        'Casa club', 'Gimnasio', 'Piscina', 'Spa', 'No cuenta con amenidades.' ];
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        getProperty();
    }, []);

    useEffect(() => {
        const checkFormValidity = () => {
            setIsFormValid(
                property?.fullAddress?.trim() &&
                property?.address?.trim() &&
                property?.location?.lat !== null &&
                property?.location?.lng !== null &&
                property?.price?.trim() &&
                property?.rooms !== null &&
                property?.bathrooms !== null &&
                property?.parkingLots !== null &&
                property?.availability?.date !== null &&
                property?.type !== null &&
                property?.description?.trim() &&
                property?.surfaceType?.trim() &&
                property?.surfaceUnit?.trim() &&
                property?.surfaceQuantity?.trim() &&
                property?.oldness !== null &&
                property?.services?.length > 0 &&
                property?.amenities?.length > 0 &&
                images.length > 0
            );
        };
        checkFormValidity();
    }, [fullAddress, address, location, price, rooms, bathrooms, parkingLots, availability, type, description,
        surfaceType, surfaceUnit, surfaceQuantity, oldness, services, amenities, images, imageNames]);

    const getProperty = async () => {
        try {
            setLoading(true);
            let { data, error } = await supabase.from('Properties').select('*').eq('id', propertyId).single();
            if (error) throw error;

            if (propertyData) {
                setFullAddress(propertyData.fullAddress);
                setAddress(propertyData.address);
                setLocation(propertyData.location);
                setPrice(propertyData.price);
                setRooms(propertyData.rooms);
                setBathrooms(propertyData.bathrooms);
                setParkingLots(propertyData.parkingLots);
                setAvailability(propertyData.availability);
                setType(propertyData.type);
                setDescription(propertyData.description);
                setSurfaceType(propertyData.surfaceType);
                setSurfaceUnit(propertyData.surfaceUnit);
                setSurfaceQuantity(propertyData.surfaceQuantity);
                setOldness(propertyData.oldness);
                setServices(propertyData.services);
                setAmenities(propertyData.amenities);
                getImages();
            }
        } catch (error) {
            console.error('Error al cargar las propiedades:', error);
        } finally {
            setLoading(false);
        }
    };

    const getImages = async () => {
        let propertyImages = [];
        try {
            let { data, error } = await supabase.storage.from('property-images').list(`${propertyId}/`);
            if (error) throw error;
            const urls = data.map(img => ({ uri:  `${SUPABASE_URL}/storage/v1/object/public/property-images/${propertyId}/${img.name}`, name: img.name }));
            setImages(urls);
            setImageNames(propertyImages.map(image => image.name));
        } catch (error) {
            console.error('Error al obtener archivos de imágenes:', error);
        } finally {
            setLoading(false)
        }
    };
    const pickImages = async () => {
        try {
            setUpLoading(true);
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                aspect: [4, 3],
                quality: 1,
                allowsMultipleSelection: true
            });
            if (!result.canceled) {
                const newImages = result.assets;
                const newImagesNames = result.assets.map((asset, index) => `${Date.now()}_${index + 1}.jpg`);
                setImages([...images, ...newImages]);
                setImageNames([...imageNames, ...newImagesNames]);
                await uploadImages(newImages, newImagesNames);
            }
        } catch (error) {
            console.error('Error al seleccionar imágenes:', error);
        } finally {
            setUpLoading(false);
        }
    };

    const uploadImages = async (newImages) => {
        try {
            await Promise.all(newImages.map(async (image, index) => {
                const resizedImage = await manipulateAsync(image.uri, [{ resize:{width:500} }], { compress: 1, format: SaveFormat.PNG });
                const fileName = `${Date.now()}_${index + 1}.png`;
                let { error } = await supabase.storage.from('property-images').upload(`${propertyId}/${fileName}`, resizedImage.uri, { contentType: 'image/png'});
                if (error) throw error;
            }));
        } catch (error) {
            console.error('Hubo un error al subir las imágenes:', error);
        }
    };

    const deleteImage = async (index) => {
        Alert.alert(
            'Confirmación',
            '¿Estás seguro de que deseas eliminar esta imagen?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => {},
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        setUpLoading(true);
                        try {
                            let { error } = await supabase.storage.from('property-images').remove([`${propertyId}/${imageName}`]);
                            if (error) throw error;
                            setImages(images.filter(img => img.name !== imageName));
                        } catch (error) {
                            console.error('Error al eliminar la imagen:', error);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };


    const editProperty = async () => {
        try {
            setUpLoading(true);
            const propertyData = {
                fullAddress: fullAddress,
                address: address,
                location: location,
                price: price,
                rooms: rooms,
                bathrooms: bathrooms,
                parkingLots: parkingLots,
                availability: availability,
                type: type,
                description: description,
                surfaceType: surfaceType,
                surfaceUnit: surfaceUnit,
                surfaceQuantity: surfaceQuantity,
                oldness: oldness,
                services: services,
                amenities: amenities,
            }

            let { error } = await supabase.from('Properties').update(property).eq('id', propertyId);
            if (error) throw error;
            Alert.alert('Éxito', 'La información de la casa se ha actualizado correctamente.');
        } catch (error) {
            Alert.alert('Error', 'Hubo un error al actualizar la información de la casa.');
        }
        finally {
            setUpLoading(false);
        }
    };

    const handleAutocomplete = (data, details) => {
        setLocation(details.geometry.location);
        setFullAddress(details.address_components);
        const addressComponents = details.address_components;
        let colony = '';
        let state = '';
        addressComponents.forEach(component => {
            if (component.types.includes('sublocality_level_1')) {
                colony = component.long_name;
            } else if (component.types.includes('locality')) {
                state = component.long_name;
                setAddress(`${colony}, ${state}`)
            }
        });
    }

    const handleServices = (option) => {
        setServices(option);
    };

    const handleAmenities = (option) => {
        setAmenities(option);
    };
    const handleAvailabilityChange = (value) => {
        setAvailability(value);
    };

    return (
        <>
            <Modal visible={loading || uploading} transparent={uploading}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large"/>
                </View>
            </Modal>
            <ScrollView style={{flex: 1, backgroundColor: 'white'}}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps={'handled'}>
                <ScrollView style={{flex: 1, backgroundColor: 'white'}}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps={'handled'}
                >
                    <Modal
                        visible={loading}
                        transparent={false}
                        animationType="fade"
                        onRequestClose={() => {}}>
                        <View>
                            <ActivityIndicator size="large"/>
                        </View>
                    </Modal>
                    <Text style={style.filterText} >Direccion</Text>
                    <ShowAddress onPress={openModal} text={fullAddress ||  'Seleccionar direccion'} />
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        onRequestClose={closeModal}
                    >
                        <View style={style.containerModalAddress}>
                            <View style={style.contentModalAddress}>
                                <GooglePlacesAutocomplete
                                    ref={GooglePlacesAutocompleteInput}
                                    placeholder='Ingresa la direccion aqui'
                                    fetchDetails={true}
                                    onPress={(data, details) => {
                                        handleAutocomplete( data, details)
                                    }}
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
                                            backgroundColor: 'white'
                                        },
                                        textInput: {
                                            color: 'black',
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            backgroundColor: 'rgba(211, 211, 211, 0.5)'
                                        },
                                    }}
                                />
                                <BlueButton text="Cerrar" onPress={closeModal} />
                            </View>
                        </View>
                    </Modal>
                    <Text style={style.filterText} >Tipo de inmueble</Text>
                    <OptionsButton
                        text={type || "¿Cual describe mejor a tu espacio?"}
                        options={optionsType}
                        onSelect={setType}
                    />
                    <Text style={style.filterText} >Descripcion</Text>
                    <TallInput
                        placeholder={"Describe tu espacio a detalle."}
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                    />
                    <Text style={style.filterText} >Recamaras</Text>
                    <RoundButtons
                        value={rooms}
                        onNumberSelected={setRooms}
                    />
                    <Text style={style.filterText} >Baños</Text>
                    <RoundButtons
                        value={bathrooms}
                        onNumberSelected={setBathrooms}
                    />
                    <Text style={style.filterText} >Estacionamientos</Text>
                    <RoundButtons
                        value={parkingLots}
                        onNumberSelected={setParkingLots}
                    />
                    <Text style={style.filterText} >Superficie</Text>
                    <SurfaceInput
                        surfaceType={surfaceType}
                        setSurfaceType={setSurfaceType}
                        unit={surfaceUnit}
                        setUnit={setSurfaceUnit}
                        quantity={surfaceQuantity}
                        setQuantity={setSurfaceQuantity}
                    />
                    <Text style={style.filterText}>Disponibilidad</Text>
                    <AvailabilityInput
                        value={availability}
                        onValueChange={handleAvailabilityChange}
                    />
                    <Text style={style.filterText}>Antigüedad</Text>
                    <OptionsButton
                        text={oldness || "¿Que tan antigüo es tu espacio?"}
                        options={optionsOldness}
                        onSelect={setOldness}
                    />
                    <Text style={style.filterText}>Sevicios</Text>
                    <MultiButton
                        options={optionsServices}
                        onSelect={handleServices}
                        text={services.length === 0 ? "¿Que servicios tiene tu espacio?" : services.join(" , ")}
                    />
                    <Text style={style.filterText}>Amenidades</Text>
                    <MultiButton
                        options={optionsAmenities}
                        onSelect={handleAmenities}
                        text={amenities.length === 0 ? '¿Que amenidades tiene tu espacio?' : amenities.join(' , ')}
                    />
                    <Text style={style.filterText} >Precio</Text>
                    <PriceInput
                        value={price}
                        onChangeText={setPrice}
                    />
                    <TouchableOpacity
                        onPress={pickImages}
                        style={style.mediaButton}
                    >
                        <Text style={style.mediaText}>Escoger imágenes</Text>
                    </TouchableOpacity>
                    <ScrollView horizontal>
                        {images.map((imageUri, index) => (
                            <TouchableOpacity key={index} onPress={() => deleteImage(index)}>
                                <Image source={{ uri: imageUri.uri }} style={{ width: 100, height: 100, margin: 5 }} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <BlueButton text="Guardar cambios" onPress={editProperty} disabled={!isFormValid}/>
                </ScrollView>
            </ScrollView>
        </>
    );
};

export default EditProperty;
