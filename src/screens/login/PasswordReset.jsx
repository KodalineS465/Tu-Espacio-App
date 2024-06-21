import React,{ useState} from "react";
import {TouchableOpacity, Text, View, TextInput, Image, ScrollView, KeyboardAvoidingView, Alert} from 'react-native';
import auth from "@react-native-firebase/auth"
import style from "../../components/Styles";
import Input from "../../components/Input";
import BlueButton from "../../components/BlueButton";

export default function PasswordReset({navigation}) {
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false);

    function HandlePasswordReset(){
        if (email) {
            auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                    setEmailSent(true);
                    console.log('Correo enviado');
                    Alert.alert(
                        "Correo enviado",
                        "Se ha enviado un correo electrónico con los pasos para restablecer tu contraseña.",
                        [
                            { text: "OK", onPress: () => navigation.navigate("Login")}
                        ]
                    );
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

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
                    <Text style={style.textTitle}>Recupera tu contraseña</Text>
                </View>
                <View style={style.mainContainer}>
                    <View style={style.inputContainer}>
                        <Text style={style.textSubtitle}>Ingresa tu correo electrónico:</Text>
                        <Input
                            placeholder="Correo electrónico"
                            value={email}
                            onChangeText={text => setEmail(text)}
                        />
                        <Text style={style.textgray}>Se enviaran los pasos para restaurar la contraseña a este correo.</Text>
                    </View>
                </View>
                <View>
                    <BlueButton text="Enviar" onPress={HandlePasswordReset} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}