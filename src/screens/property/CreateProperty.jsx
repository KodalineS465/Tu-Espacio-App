import React, { useState, useEffect, useRef} from 'react';
import {
    View,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
    Modal,
    Text,
    TouchableOpacity,
    Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { manipulateAsync, SaveFormat} from 'expo-image-manipulator';
import PriceInput from "../../components/PriceInput";
import RoundButtons from "../../components/RoundButtons";
import SurfaceInput from "../../components/SurfaceInput";
import style from "../../components/Styles";
import AvailabilityInput from "../../components/AvailabilityInput";
import OptionsButton from "../../components/OptionsButton";
import TallInput from "../../components/TallInput";
import MultiButton from "../../components/MultiButton";
import BlueButton from "../../components/BlueButton";
import ShowAddress from "../../components/ShowAddress";
import Scale from "../../components/Scale";

const GOOGLE_API_KEYS = {
    android: process.env.EXPO_PUBLIC_GOOGLE_API_KEY_ANDROID,
    ios: process.env.EXPO_PUBLIC_GOOGLE_API_KEY_IOS
};

const GOOGLE_API_KEY = GOOGLE_API_KEYS[Platform.OS];

const CreateProperty = ({navigation}) => {
    const [fullAddress, setFullAddress] = useState('');
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState({ "lat": 0, "lng": 0 });
    const [price, setPrice] = useState('');
    const [rooms, setRooms] = useState(null);
    const [bathrooms, setBathrooms] = useState(null);
    const [parkingLots, setParkingLots] = useState(null);
    const [availability, setAvailability] = useState({ date: null, isAvailableNow: true});
    const [type, setType] = useState(null);
    const [description, setDescription] = useState('');
    const [surfaceType, setSurfaceType] = useState('');
    const [surfaceUnit, setSurfaceUnit] = useState('');
    const [surfaceQuantity, setSurfaceQuantity] = useState('');
    const [oldness, setOldness] = useState(null);
    const [services, setServices] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [zipCode, setZipCode] = useState('')
    const GooglePlacesAutocompleteInput = useRef();
    const [average, setAverage] = useState('');
    const [initial_interval, setInitial_interval] = useState('');
    const [final_interval, setFinal_interval] = useState('');
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
        if (zipCode !== '') {
            fetchAverageFromDatabase(zipCode).then(result => {
            }).catch(error => {
                console.error(error);
            });
        }
    }, [zipCode]);

    const fetchAverageFromDatabase = async (zipCode) => {
        try {
            const querySnapshot = await firestore()
                .collection('bayesian_regression')
                .where('zip_code', '==', zipCode)
                .limit(1)
                .get();

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const data = doc.data();
                if (data.zip_code === zipCode) {
                    setAverage(data.promedio);
                    setInitial_interval(data.intervalo_confianza_desde)
                    setFinal_interval(data.intervalo_confianza_hasta)
                } else {
                    setAverage('');
                }
            } else {
                setAverage('');
            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        const checkFormValidity = () => {
            setIsFormValid(
                fullAddress !== '' &&
                address !== '' &&
                location.lat !== 0 &&
                location.lng !== 0 &&
                price !== '' &&
                rooms !== null &&
                bathrooms !== null &&
                parkingLots !== null &&
                availability !== { date: null, now: false } &&
                type !== null &&
                description !== '' &&
                surfaceType !== '' &&
                surfaceUnit !== '' &&
                surfaceQuantity !== '' &&
                oldness !== null &&
                services.length !== 0 &&
                amenities.length !== 0 &&
                images.length !== 0
            );
        };
        checkFormValidity();
    }, [fullAddress, address, location, price, rooms, bathrooms, parkingLots, availability, type, description,
        surfaceType, surfaceUnit, surfaceQuantity, oldness, services, amenities, images]);

    useEffect(() => {
        GooglePlacesAutocompleteInput.current?.setAddressText('');
    }, [fullAddress]);
    const pickImages = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                aspect: [4, 3],
                quality: 1,
                allowsMultipleSelection: true
            });
            if (!result.canceled) {
                setImages(result.assets.map(asset => asset.uri));
            }
        } catch (error) {
            console.error('Error al seleccionar imágenes:', error);
        }
    };

    const uploadProperty = async () => {
        try {
            setLoading(true);
            const userInfo = auth().currentUser;
            const propertyData = {
                user: userInfo.uid,
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
                createdAt: firestore.FieldValue.serverTimestamp()
            };
            const docRef = await firestore().collection('Properties').add(propertyData);
            const propertyId = docRef.id;
            await uploadImages(propertyId);
        } catch (error) {
            setLoading(false)
            Alert.alert('Error', 'Hubo un error al subir tu espacio. Por favor, inténtalo de nuevo más tarde.');
        }
    };

    const uploadImages = async (propertyId) => {
        try {
            if (images.length === 0) {
                Alert.alert('Éxito', 'Tu espacio se ha subido correctamente.');
                return;
            }

            const folderRef = storage().ref().child(`images/${propertyId}`);
            const uploadTasks = images.map(async (image, index) => {
                const resizedImage = await manipulateAsync(
                    image,
                    [{ resize:{width:500} }],
                    { compress: 1, format: SaveFormat.PNG }
                );
                const imageName = `${Date.now()}_${index + 1}.jpg`;
                const reference = folderRef.child(imageName);
                await reference.putFile(resizedImage.uri);
            });

            await Promise.all(uploadTasks);
            Alert.alert('Éxito', 'Tu espacio se ha subido correctamente.');
        } catch (error) {
            console.error(error)
            Alert.alert('Error', 'Hubo un error al subir imagenes a tu espacio. Por favor, inténtalo de nuevo más tarde.');
        }
        finally {
            setLoading(false)
            navigation.navigate('Property');
        }
    };

    const handleAutocomplete = (data, details) => {
        setLocation(details.geometry.location);
        setFullAddress(details.formatted_address);

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

        if (details && details.address_components) {
            const zipCodeComponent = details.address_components.find(component =>
                component.types.includes('postal_code')
            );

            if (zipCodeComponent) {
                const zipCode = zipCodeComponent.long_name;
                setZipCode(zipCode)
            } else {
                setZipCode('')
            }
        }
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
                                placeholder='Ingresa la dirección aquí'
                                fetchDetails={true}
                                onPress={(data, details) => {
                                    handleAutocomplete(data, details);
                                    closeModal()
                                }}
                                query={{
                                    key: GOOGLE_API_KEY,
                                    language: 'es',
                                    components: 'country:mx',
                                    types: 'address',
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
                <View style={style.priceContainer}>
                    <Text
                        style={style.showRecommendationText}
                    >
                        {average ? `Precio recomendado por ubicación: $${Math.floor(average * 10) / 10}`
                            : "No hay recomendación para esta ubicación"}
                    </Text>
                    {average ? <Scale since={Math.floor(initial_interval * 10) / 10} mid={Math.floor(average * 10) / 10} from={Math.floor(final_interval * 10) / 10}/> : null}

                    <PriceInput
                        value={price}
                        onChangeText={setPrice}
                    />


                </View>

                <View style={style.mainContainer}>
                    <TouchableOpacity
                        onPress={pickImages}
                        style={style.mediaButton}
                    >
                        <Text style={style.mediaText}>Escoger imágenes</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal>
                    {images && images.map((imageUri, index) => (
                        <Image
                            key={index}
                            source={{ uri: imageUri }}
                            style={{width:100, height:100}}
                        />
                    ))}
                </ScrollView>
                <BlueButton
                    text="Crear"
                    onPress={uploadProperty}
                    disabled={!isFormValid}
                />
            </ScrollView>
        </ScrollView>
    );
};



export default CreateProperty;