import React, { useEffect, useState } from "react";
import {Alert, Image, KeyboardAvoidingView, Linking, ScrollView, StyleSheet, Text, View} from 'react-native';
import auth from "@react-native-firebase/auth";
import BlueButton from "../../components/BlueButton";
import Input from "../../components/Input";
import BlueText from "../../components/BlueText";
import CheckCircle from "../../components/CheckCircle";
import DivisionLine from "../../components/DivisionLine";
import firestore from "@react-native-firebase/firestore";

export default function Registry({ navigation }) {
    const [isCheckedAge, setIsCheckedAge] = useState(false);
    const [isCheckedTerms, setIsCheckedTerms] = useState(false);
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    const nameRegex = /^[a-zA-Z\s']{2,50}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/;

    const handleButtonPress = () => {
        Linking.openURL('https://sites.google.com/alumnos.udg.mx/tuespacioapp-terminos?usp=sharing');
    };

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


    const handleContinue = async () => {
        if (formIsValid) {
            Alert.alert('Formulario válido, puedes continuar');
            try {
                await auth()
                    .createUserWithEmailAndPassword(email, password);

                console.log(auth().currentUser)
                await uploadUser(auth().currentUser); // Pasar user y additionalUserInfo aquí
            } catch (error) {
                let errorMessage = 'Hubo un problema al crear la cuenta. Por favor, inténtalo de nuevo más tarde.';
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'El correo electrónico ya está en uso. Por favor, utiliza otro correo electrónico.';
                }
                Alert.alert("Error", errorMessage);
            }
        } else {
            Alert.alert('Informacion no valida');
        }
    };

    async function uploadUser(user) {
        try {
            await firestore().collection('Users').doc(user.uid).set({
                name: name + " " + lastname,
                email: user.email,
                photoURL: '',
                emailVerified: user.emailVerified,
                accountVerified: false,
                provider: 'email'
            });
            console.log('Usuario creado y datos guardados en Firestore.');
        } catch (error) {
            console.error('Error al subir usuario a Firestore:', error);
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
                            placeholder="nombre"
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

                        <Input
                            placeholder="Contraseña"
                            value={password}
                            onChangeText={setPassword}
                            onBlur={handleBlurPassword}
                            style={{ borderColor: passwordError && password !== "" ? 'red' : null }}
                        />
                        {passwordError && password !== "" ? <Text style={styles.errorMessage}>{passwordError}</Text> : null}

                        <Input
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            onBlur={handleBlurConfirmPassword}
                            style={{ borderColor: confirmPasswordError && confirmPassword !== ""? 'red' : null }}
                        />
                        {confirmPasswordError && confirmPassword !== ""? <Text style={styles.errorMessage}>{confirmPasswordError}</Text> : null}

                        <CheckCircle title="Confirmo que soy mayor de edad." isChecked={isCheckedAge} onPress={value => setIsCheckedAge(value)} />
                        <CheckCircle title="Confirmo que he leído y acepto los términos y condiciones establecidos." isChecked={isCheckedTerms} onPress={value => setIsCheckedTerms(value)} />
                    </View>
                </View>
                <BlueButton text="Registrarme" onPress={handleContinue} disabled={!isCheckedAge || !isCheckedTerms } />
                <DivisionLine />
                <View style={styles.mainContainer}>
                    <BlueText text="Consultar terminos y condiciones" onPress={handleButtonPress} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

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
});
