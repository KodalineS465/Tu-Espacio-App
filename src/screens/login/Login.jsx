import React, {useState} from "react";
import {Image, KeyboardAvoidingView, ScrollView, Text, View, Linking} from 'react-native';
import auth from "@react-native-firebase/auth"
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import OrLine from "../../components/OrLine";
import GoogleButton from "../../components/GoogleButton";
import style from "../../components/Styles";
import BlueButton from "../../components/BlueButton";
import BlueText from "../../components/BlueText";
import DivisionLine from "../../components/DivisionLine";
import Input from "../../components/Input";
import HiddenInput from "../../components/HiddenInput";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;

GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
});

export default function Login({navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function onGoogleButtonPress()
    {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const { user, additionalUserInfo } = await auth().signInWithCredential(googleCredential);
        if (additionalUserInfo.isNewUser) {
            uploadUser(user, additionalUserInfo);
        } else {
            console.log('Usuario existente inició sesión.');
        }
    }

    async function uploadUser(user, additionalUserInfo) {
        try {
            const imageURL = await uploadProfileImage(user.photoURL);

            await firestore().collection('Users').doc(user.uid).set({
                name: user.displayName,
                email: user.email,
                photoURL: imageURL,
                emailVerified: user.emailVerified,
                accountVerified: false,
                provider: additionalUserInfo.providerId
            });
            console.log('Usuario creado y datos guardados en Firestore.');
        } catch (error) {
            console.error('Error al subir usuario a Firestore:', error);
        }
    }

    async function uploadProfileImage(photoURL) {
        try {
            const response = await fetch(photoURL);
            const blob = await response.blob();

            const fileName = `Profiles/${Date.now()}-${Math.floor(Math.random() * 100000)}.jpg`;
            const reference = storage().ref(fileName);
            await reference.put(blob);
            console.log('Imagen de perfil subida a Firebase Storage.');
            return await reference.getDownloadURL();
        } catch (error) {
            console.error('Error al subir imagen de perfil a Firebase Storage:', error);
            return null;
        }
    }
    function HandleEmailLogin(){
        if (email && password) {
            auth()
                .signInWithEmailAndPassword( email, password)
                .then(() => {
                    console.log('User account signed in!');
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                    }

                    console.error(error);
                });
        }
    }

    const handleButtonPress = () => {
        Linking.openURL('https://sites.google.com/alumnos.udg.mx/tuespacioapp-terminos?usp=sharing');
    };

    return (
        <KeyboardAvoidingView
            style={style.fullContainer}
            behavior="padding"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View style={style.logoContainer}>
                    <Image source={require('../../assets/logo.png')}
                           style={style.logo}/>
                </View>
                <View style={style.titleContainer}>
                    <Text style={style.textTitle}>¡Bienvenido a Tu Espacio!</Text>
                </View>
                <GoogleButton title="Iniciar con Google"
                              onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!')).catch(error => alert(error.message))}
                />
                <OrLine />
                <View style={style.mainContainer}>
                    <View style={style.inputContainer}>
                        <Text style={style.textSubtitle}>Iniciar con correo electronico:</Text>
                        <Input placeholder="email" value={email} onChangeText={text => setEmail(text)} />
                        <HiddenInput placeholder="contraseña" value={password} onChangeText={text => setPassword(text)}/>
                    </View>
                </View>
                <BlueButton text="Ingresar" onPress={HandleEmailLogin} />
                <View style={style.mainContainer}>
                    <BlueText text="¿Olvidaste tu contraseña?" onPress={() => {navigation.push("PasswordReset")}} />
                    <BlueText text="Consultar terminos y condiciones" onPress={handleButtonPress} />
                </View>
                <DivisionLine />
                <View style={style.mainContainer}>
                    <View style={style.allInOneContainer}>
                        <Text style={style.textSubtitle}>No tengo cuenta.</Text>
                        <Text style={style.textBlue} onPress={() => {navigation.push("Registry")}}>Registrarme.</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}