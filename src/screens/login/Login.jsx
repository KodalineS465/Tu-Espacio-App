import React, { useState, useEffect } from "react";
import { Image, KeyboardAvoidingView, ScrollView, Text, View, Linking, Alert } from 'react-native';
import { supabase } from '../../../supabase'; // Cliente de Supabase
import OrLine from "../../components/OrLine";
import GoogleButton from "../../components/GoogleButton";
import style from "../../components/Styles";
import BlueButton from "../../components/BlueButton";
import BlueText from "../../components/BlueText";
import DivisionLine from "../../components/DivisionLine";
import Input from "../../components/Input";
import HiddenInput from "../../components/HiddenInput";

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Verificar si hay una sesión activa al cargar el componente
    useEffect(() => {
        async function checkSession() {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    console.error("Error obteniendo sesión: ", error.message);
                    Alert.alert("Error", "No se pudo verificar la sesión.");
                    return;
                }

                if (data?.session) {
                    console.log("Sesión activa: ", data.session);
                    navigation.replace("Home"); // Redirigir a la pantalla principal (Home)
                } else {
                    console.warn("No hay sesión activa.");
                }
            } catch (err) {
                console.error("Error verificando sesión: ", err);
                Alert.alert("Error", "Ocurrió un problema al verificar la sesión.");
            }
        }
        checkSession();
    }, []);

    // Manejar inicio de sesión con correo y contraseña
    async function HandleEmailLogin() {
        if (!email || !password) {
            Alert.alert("Error", "Por favor, ingresa tu correo y contraseña.");
            return;
        }

        // Validar formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Por favor, ingresa un correo electrónico válido.");
            return;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                console.error("Error al iniciar sesión: ", error.message);
                Alert.alert("Error", error.message);
                return;
            }

            console.log("Inicio de sesión exitoso: ", data);
            Alert.alert("Éxito", "Inicio de sesión exitoso.");
            navigation.replace("Home"); // Redirigir a la pantalla principal (Home)
        } catch (err) {
            console.error("Error en el inicio de sesión: ", err);
            Alert.alert("Error", "No se pudo iniciar sesión.");
        }
    }

    // Manejar inicio de sesión con Google
    async function onGoogleButtonPress() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'https://vysrppzcjjyxazjlqpxj.supabase.co/auth/v1/callback'
                }
            });

            if (error) {
                console.error('Error al iniciar sesión con Google: ', error.message);
                Alert.alert('Error', 'Hubo un problema al iniciar sesión con Google.');
                return;
            }

            console.log("Inicio de sesión con Google exitoso: ", data);
            navigation.replace("Home"); // Redirigir a la pantalla principal (Home)
        } catch (err) {
            console.error('Error en la autenticación con Google: ', err);
            Alert.alert('Error', 'No se pudo completar el inicio de sesión.');
        }
    }

    // Abrir términos y condiciones
    const handleButtonPress = () => {
        Linking.openURL('https://sites.google.com/alumnos.udg.mx/tuespacioapp-terminos?usp=sharing');
    };

    return (
        <KeyboardAvoidingView style={style.fullContainer} behavior="padding">
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={style.logoContainer}>
                    <Image source={require('../../assets/logo.png')} style={style.logo} />
                </View>

                <View style={style.titleContainer}>
                    <Text style={style.textTitle}>¡Bienvenido a Tu Espacio!</Text>
                </View>

                <GoogleButton
                    title="Iniciar con Google"
                    onPress={onGoogleButtonPress}
                />

                <OrLine />

                <View style={style.mainContainer}>
                    <View style={style.inputContainer}>
                        <Text style={style.textSubtitle}>Iniciar con correo electrónico:</Text>
                        <Input placeholder="Correo" value={email} onChangeText={setEmail} />
                        <HiddenInput placeholder="Contraseña" value={password} onChangeText={setPassword} />
                    </View>
                </View>

                <BlueButton text="Ingresar" onPress={HandleEmailLogin} />

                <View style={style.mainContainer}>
                    <BlueText text="¿Olvidaste tu contraseña?" onPress={() => navigation.push("PasswordReset")} />
                    <BlueText text="Consultar términos y condiciones" onPress={handleButtonPress} />
                </View>

                <DivisionLine />

                <View style={style.mainContainer}>
                    <View style={style.allInOneContainer}>
                        <Text>
                            <Text style={style.textSubtitle}>No tengo cuenta.</Text>
                            <Text style={style.textBlue} onPress={() => navigation.push("Registry")}> Registrarme.</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}