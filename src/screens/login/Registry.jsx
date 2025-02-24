import React, { useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Linking, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '../../../supabase';
import BlueButton from "../../components/BlueButton";
import Input from "../../components/Input";
import BlueText from "../../components/BlueText";
import CheckCircle from "../../components/CheckCircle";
import DivisionLine from "../../components/DivisionLine"

/* Componente de pantalla de registro en la aplicación. Permite a los usuarios ingresar su información y registrarse mediante Supabase. */
export default function Registry({ navigation }) {
    const [isCheckedAge, setIsCheckedAge] = useState(false);
    const [isCheckedTerms, setIsCheckedTerms] = useState(false);

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [PasswordVisible, setPasswordVisible] = useState('');
    const [ConfirmPasswordVisible, setConfirmPasswordVisible] = useState('');
    
    const [formIsValid, setFormIsValid] = useState(false);
    const [nameIsValid, setNameIsValid] = useState(false);
    const [lastnameIsValid, setLastnameIsValid] = useState(false);
    const [emailIsValid, setEmailIsValid] = useState(false);
    const [passwordIsValid, setPasswordIsValid] = useState(false);
    const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState(false);
    
    const [nameError, setNameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // Expresiones regulares para validar los campos
    const nameRegex = /^[a-zA-Z\s']{2,50}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/;

    // enlace para terminos y condiciones
    const handleButtonPress = () => {
        Linking.openURL('https://sites.google.com/alumnos.udg.mx/tuespacioapp-terminos?usp=sharing');
    };

    // Efecto que actualiza la validez del formulario en función de los campos ingresados.
    useEffect(() => {
        setFormIsValid(
            nameIsValid &&
            lastnameIsValid &&
            emailIsValid &&
            passwordIsValid &&
            confirmPasswordIsValid &&
            isCheckedAge &&
            isCheckedTerms
        )
    }, [nameIsValid, lastnameIsValid, emailIsValid, passwordIsValid, confirmPasswordIsValid, isCheckedAge, isCheckedTerms]);

    const validateName = (input) => {
        return nameRegex.test(input);
    };

    const validateEmail = (input) => {
        return emailRegex.test(input);
    };

    const validatePassword = (input) => {
        return passwordRegex.test(input);
    };

    const validateConfirmPassword = (input) => {
        return password === input;
    };

    const handleBlurName = () => {
        setNameIsValid(validateName(name));
        setNameError(validateName(name) ? '' : 'El nombre debe contener solo letras y espacios, y tener entre 2 y 50 caracteres.');
    };

    const handleBlurLastname = () => {
        setLastnameIsValid(validateName(lastname));
        setLastnameError(validateName(lastname) ? '' : 'El apellido debe contener solo letras y espacios, y tener entre 2 y 50 caracteres.');
    };

    const handleBlurEmail = () => {
        setEmailIsValid(validateEmail(email));
        setEmailError(validateEmail(email) ? '' : 'El correo electrónico no es válido.');
    };

    const handleBlurPassword = () => {
        setPasswordIsValid(validatePassword(password));
        setPasswordError(validatePassword(password) ? '' : 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.');
    };

    const handleBlurConfirmPassword = () => {
        setConfirmPasswordIsValid(validateConfirmPassword(confirmPassword));
        setConfirmPasswordError(validateConfirmPassword(confirmPassword) ? '' : 'Las contraseñas no coinciden.');
    };


    // Función para manejar el registro de usuario en Supabase.
    const handleContinue = async () => {
        console.log('Hello world')
        Alert.alert("DebugHandleContinue", "Esto confirma que la función se ejecuta");
        if (formIsValid) {
            try {
                Alert.alert("DebugAlert", "Esto confirma que la función se ejecuta");
                console.log("📡 Intentando registrar usuario en Supabase...");
                
                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password
                });
    
                if (error){
                    console.error("🚨 Error en Supabase Auth:", error.message);
                    throw error;
                }

                console.log("✅ Usuario creado en Auth:", data.user);
                console.log(data.user);
                await uploadUser(data.user);
                Alert.alert('Formulario válido, puedes continuar');
            } catch (error) {
                let errorMessage = 'Hubo un problema al crear la cuenta. Por favor, inténtalo de nuevo más tarde.';
                if (error.message.includes('User already registered')) {
                    errorMessage = 'El correo electrónico ya está en uso. Por favor, utiliza otro correo electrónico.';
                }
                Alert.alert('Error', errorMessage);
            }
        } else {
            Alert.alert('Información no válida');
        }
    };
    
    async function uploadUser(user) {
        Alert.alert("DebugUploadUser", "Esto confirma que la función se ejecuta");
        console.log(error.message);
        try {
            Alert.alert("Debugtry", "Esto confirma que la función se ejecuta");
            const { error } = await supabase.from('Users').insert([
                {
                    id: user?.id,
                    name: name + " " + lastname,
                    email: user?.email,
                    photoURL: '',
                    emailVerified: !!user?.email_confirmed_at,
                    accountVerified: false,
                    provider: 'email'
                }
            ]);
    
            if (error) throw error;
    
            console.log('Usuario creado y datos guardados en Supabase.');
        } catch (error) {
            console.error('Error al subir usuario a Supabase:', error);
        }
    }
    
return (
    <KeyboardAvoidingView style={styles.fullContainer} behavior="padding">
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.textTitle}>¡Bienvenido a Tu Espacio!</Text>
            </View>
            <View style={styles.mainContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.textSubtitle}>Registrarse con correo electrónico:</Text>
                    <Input
                        placeholder="Nombre"
                        value={name}
                        onChangeText={setName}
                        onBlur={handleBlurName}
                        style={{ borderColor: nameError && name !== "" ? 'red' : null }}
                    />
                    {nameError && name !== "" ? <Text style={styles.errorMessage}>{nameError}</Text> : null}

                    <Input
                        placeholder="Apellido"
                        value={lastname}
                        onChangeText={setLastname}
                        onBlur={handleBlurLastname}
                        style={{ borderColor: lastnameError && lastname !== "" ? 'red' : null }}
                    />
                    {lastnameError && lastname !== "" ? <Text style={styles.errorMessage}>{nameError}</Text> : null}

                    <Input
                        placeholder="Correo"
                        value={email}
                        onChangeText={setEmail}
                        onBlur={handleBlurEmail}
                        style={{ borderColor: emailError && email !== "" ? 'red' : null }}
                    />
                    {emailError && email !== "" ? <Text style={styles.errorMessage}>{emailError}</Text> : null}
                    <View style={styles.passwordContainer}>
                        <Input
                            placeholder="Contraseña"
                            value={password}
                            onChangeText={setPassword}
                            onBlur={handleBlurPassword}
                            secureTextEntry={!PasswordVisible}
                            style={{borderColor: passwordError && password !== "" ? 'red' : null }}
                        />
                        <TouchableOpacity
                            onPress={() => setPasswordVisible(!PasswordVisible)} style={styles.iconContainer} >
                            <Image source={PasswordVisible ? require('../../assets/mostrar.png') : require('../../assets/ocultar.png')} style={styles.icon2} />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorMessage}>{passwordError}</Text> : null}

                    <View style={styles.passwordContainer}>
                        <Input
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            onBlur={handleBlurConfirmPassword}
                            secureTextEntry={!ConfirmPasswordVisible}
                            style={{ borderColor: confirmPasswordError && confirmPassword !== ""? 'red' : null }}
                        />                      
                        <TouchableOpacity
                            onPress={() => setConfirmPasswordVisible(!ConfirmPasswordVisible)} style={styles.iconContainer2} >
                            <Image source={ConfirmPasswordVisible ? require('../../assets/mostrar.png') : require('../../assets/ocultar.png')} style={styles.icon2} />
                        </TouchableOpacity>
                    </View>
                    {confirmPasswordError ? <Text style={styles.errorMessage}>{confirmPasswordError}</Text> : null}

                    <CheckCircle title="Confirmo que soy mayor de edad." isChecked={isCheckedAge} onPress={() => setIsCheckedAge(!isCheckedAge)} />
                    <CheckCircle title="Confirmo que he leído y acepto los términos y condiciones establecidos." isChecked={isCheckedTerms} onPress={() => setIsCheckedTerms(!isCheckedTerms)} />
                </View>
            </View>
            <BlueButton text="Registrarme" onPress={handleContinue} disabled={!isCheckedAge || !isCheckedTerms } />
            <DivisionLine />
            <View style={styles.mainContainer}>
                <BlueText text="Consultar terminos y condiciones" onPress={handleButtonPress} />
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
);}

const styles = StyleSheet.create({
    fullContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    textTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333', // Color de texto oscuro
    },
    mainContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    textSubtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333333',
    },
    errorMessage: {
        color: 'red',
        marginBottom: 5,
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
    },
    iconContainer2: {
        position: 'absolute',
        right: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon2: {
        width: 20,
        height: 20,
        marginRight: 10,
        marginTop: 20,
        opacity: 0.4,  // 40% de opacidad
    },
});
