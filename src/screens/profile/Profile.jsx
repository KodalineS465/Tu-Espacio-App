import { ActivityIndicator, Linking, Modal, ScrollView, Text, View } from 'react-native';
import ProfileInfo from "../../components/ProfileInfo";
import style from "../../components/Styles";
import LessorButton from "../../components/LessorButton";
import BlueTitle from "../../components/BlueTitle";
import MoreButton from "../../components/MoreButton";
import BlueButton from "../../components/BlueButton";
import React, { useContext, useEffect, useState } from "react";
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import UserContext from "../../utils/UserProvider";
import PersonalInformation from "../../components/PersonalInformation";
import * as ImagePicker from 'expo-image-picker';
import DivisionLine from "../../components/DivisionLine";

import { supabase } from '../../../supabase';

export default function Profile({ navigation }) {
    const { isLessor, setIsLessor } = useContext(UserContext);
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [fileContent, setFileContent] = useState('');

    const handleButtonPress = () => {
        Linking.openURL('https://sites.google.com/alumnos.udg.mx/tuespacioapp-terminos?usp=sharing');
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const HandleSignOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error al cerrar sesión: ', error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
            setLoading(true);
            const { data: userData, error } = await supabase.auth.getUser();
            if (error) throw error;
            const { data, error: userError } = await supabase
                .from('Users')
                .select('*')
                .eq('id', userData.user.id)
                .single();
            if(userError) throw userError;
            const nameParts = data.name.split(' ');
            setUser({ ...data, firstName: nameParts[0] });
        } catch (error) {
            console.error('Error al cargar usuario: ', error);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        try {
            setLoading(true);
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 3],
                quality: 1,
                allowsMultipleSelection: false // Cambiado a false para permitir solo la selección de una imagen
            });
            if (!result.canceled) {
                const imageURI = result.assets[0].uri; // Obtiene la URI de la imagen seleccionada
                console.log('Imagen seleccionada:', imageURI);
                await uploadUser(imageURI); // Llama a la función uploadUserWithImage pasando la URI de la imagen
            } else {
                console.log('No se seleccionó ninguna imagen.');
            }
        } catch (error) {
            console.error('Error al seleccionar imagen:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const uploadUser = async (imageUrl) =>{
        try {
            const imageURL = await uploadProfileImage(imageUrl);
            await supabase
                .from('Users')
                .update({ photoURL: imageURL })
                .eq('id', user.id);
        } catch (error) {
            console.error('Error al subir usuario: ', error);
        }
    };

    const uploadProfileImage = async (photoURL) => {
        try {
            const response = await fetch(photoURL);
            const blob = await response.blob();
            const fileName = `Profiles/${Date.now()}-${Math.floor(Math.random() * 100000)}.jpg`;
            const { data, error } = await supabase.storage.from('profile-pictures').upload(fileName, blob);
            if (error) throw error;
            return data.path;
        } catch (error) {
            console.error('Error al subir imagen: ', error);
            return null;
        }
    };

    const handleEmailButtonPress = () => {
        const recipientEmail = 'tuespacio403@gmail.com';
        Linking.openURL(`mailto:${recipientEmail}`);
    };


    return (
        <>
            <Modal visible={loading}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large"/>
                </View>
            </Modal>
            <View style={style.screenContainer}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <Text style={style.screenTitle}>Perfil</Text>
                    <ProfileInfo
                        firstName={user? user.firstName : "Nombre"}
                        email={user? user.email : "Correo"}
                        image={ user? user.photoURL : resolveAssetSource(require("../../assets/not-image.png")).uri}
                        verified={ user ? user.verified : false}
                        name={ user? user.name : "Usuario"}
                    />
                    { isLessor ? <DivisionLine/> : <LessorButton onPress={() => {isLessor? setIsLessor(false) : setIsLessor(true)}} />}

                    <BlueTitle text="Configuracion" />
                    <MoreButton
                        text="Información personal"
                        onPress={openModal}
                        img={require('../../assets/profile.png')}
                    />
                    <PersonalInformation
                        isVisible={modalVisible}
                        onClose={closeModal}
                        name={user? user.name : "Usuario"}
                        email={user? user.email : "Correo"}
                        editImage={pickImage}
                    />
                    <BlueTitle text="Asistencia" />
                    <MoreButton
                        text="Envíanos tus comentarios"
                        onPress={handleEmailButtonPress}
                        img={require('../../assets/edit.png')}
                    />
                    <BlueTitle text="Legal" />
                    <MoreButton text="Consultar terminos y condiciones" onPress={handleButtonPress} img={require('../../assets/book.png')} />
                    <BlueTitle text="Modo anfitrión" />
                    <MoreButton
                        text={isLessor? "Cambiar a modo explorador" : "Cambiar a modo anfitrión"}
                        onPress={() => {isLessor? setIsLessor(false) : setIsLessor(true)}}
                        img={require('../../assets/doblearrow.png')}
                    />
                    <BlueButton text="Cerrar sesion" onPress={HandleSignOut} />
                </ScrollView>
            </View>
        </>
    )
}