import React, { useState, useEffect } from "react";
import { Image, KeyboardAvoidingView, ScrollView, Text, View, Linking, Alert } from 'react-native';
import { supabase } from '../../../supabase'; // Importación del cliente de Supabase para autenticación
import OrLine from "../../components/OrLine";
import GoogleButton from "../../components/GoogleButton";
import style from "../../components/Styles"; // Archivo de estilos centralizado
import BlueButton from "../../components/BlueButton";
import BlueText from "../../components/BlueText";
import DivisionLine from "../../components/DivisionLine";
import Input from "../../components/Input";
import HiddenInput from "../../components/HiddenInput";

// Componente funcional Login que maneja la autenticación del usuario
export default function Login({ navigation }) {
    // Estados para manejar los valores de entrada del usuario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Comprobación de sesión activa al cagar el componente
    useEffect(() => {
        async function checkSession() {
            try {
                const { data } = await supabase.auth.getSession();
                console.log("Session: ", data.session);

                if (error) {
                    console.error("Error obteniendo usuario3: ", error.message);
                    return;
                }

                if (data?.session) {
                    navigation.replace("Profile");
                } else {
                    console.warn("No hay sesión activa.");
                }
            } catch (err) {
                console.error("Error verificando sesión: ", err);
            }
        }
        checkSession();
    }, []);

    /**
     * Maneja el inicio de sesión con correo y contraseña.
     * Si ambos campos están llenos, intenta autenticar con Supabase.
     * En caso de error, se muestra en la consola.
     */
    async function HandleEmailLogin() {
        if (!email || !password) {
            Alert.alert("Error", "Por favor, ingresa tu correo y contraseña.");
            return;
        }
    
        // Intentar iniciar sesión con Supabase
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
        if (error) {
            console.error('Error al iniciar sesión: ', error.message);
            Alert.alert("Error", error.message);
        } else {
            console.log('Usuario inició sesión correctamente.', data);
            // Aquí puedes redirigir a la siguiente pantalla si es necesario
            navigation.replace("Profile");
        }
    }

    /**
     * Abre un enlace externo con los términos y condiciones.
     * Utiliza Linking de React Native para abrir el navegador predeterminado.
     */
    const handleButtonPress = () => {
        Linking.openURL('https://sites.google.com/alumnos.udg.mx/tuespacioapp-terminos?usp=sharing');
    };

    async function onGoogleButtonPress() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google', // proveedor de autenticación
                options: {
                    redirectTo: 'https://vysrppzcjjyxazjlqpxj.supabase.co/auth/v1/callback' // URL de redirección
                }
            });

            console.log("DATA: ", data);
            if (error) {
                console.error('Error al iniciar sesión con Google: ', error);
                alert('Hubo un problema al inciar sesión con Google');
            }
        } catch (err) {
            console.error('Error en la autenticación: ', err);
            alert('No se pudo completar el inicio de sesión.');
        }
    }

    return (
        <KeyboardAvoidingView style={style.fullContainer} behavior="padding">
            <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                {/* Sección del logo */}
                <View style={style.logoContainer}>
                    <Image source={require('../../assets/logo.png')} style={style.logo}/>
                </View>

                {/* Mensaje de bienvenida */}
                <View style={style.titleContainer}>
                    <Text style={style.textTitle}>¡Bienvenido a Tu Espacio!</Text>
                </View>

                {/* Botón para iniciar sesión con Google */}
                <GoogleButton 
                    title="Iniciar con Google"
                    onPress={() => 
                        onGoogleButtonPress()
                        .then(() => console.log('Signed in with Google!'))
                        .catch(error => alert(error.message))
                    }
                />

                <OrLine /> {/* Línea divisoria entre opciones de inicio de sesión */}
                
                {/* Formulario para inicio de sesión con correo y contraseña */}
                <View style={style.mainContainer}>
                    <View style={style.inputContainer}>
                        <Text style={style.textSubtitle}>Iniciar con correo electronico:</Text>
                        <Input placeholder="email" value={email} onChangeText={text => setEmail(text)} />
                        <HiddenInput placeholder="contraseña" value={password} onChangeText={text => setPassword(text)}/>
                    </View>
                </View>

                {/* Botón para iniciar sesión con email */}
                <BlueButton text="Ingresar" onPress={HandleEmailLogin} />
                
                {/* Opciones adicionales */}
                <View style={style.mainContainer}>
                    <BlueText text="¿Olvidaste tu contraseña?" onPress={() => {navigation.push("PasswordReset")}} />
                    <BlueText text="Consultar terminos y condiciones" onPress={handleButtonPress} />
                </View>

                <DivisionLine /> {/* Línea divisoria */}

                {/* Enlace para registro si el usuario no tiene cuenta */}
                <View style={style.mainContainer}>
                    <View style={style.allInOneContainer}>
                        <Text>
                            <Text style={style.textSubtitle}>No tengo cuenta.</Text>
                            <Text style={style.textBlue} onPress={() => {navigation.push("Registry")}}> Registrarme.</Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}