import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import ShowMessage from "../../components/ShowMessage";
import style from "../../components/Styles";
import ShowMessageChatbot from "../../components/ShowMessageChatbot";
const Message = ({ navigation, route}) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (route.params) {
            const {userId, propertyId, userPic} = route.params;
            navigation.push("Chat", {userId: userId, propertyId: propertyId, userPic: userPic})
        }
    }, [route]);

    useEffect(() => {
        const userUid = auth().currentUser.uid;
        const chatsRef = database().ref("chats").orderByChild(`usuarios/${userUid}`).equalTo(true);

        const fetchData = async (snapshot) => {
            const chatsData = [];

            await Promise.all(Object.entries(snapshot.val()).map(async ([chatKey, chatData]) => {
                const usuariosChat = chatData.usuarios;
                let otherUserId = Object.keys(usuariosChat).find(id => id !== userUid);
                otherUserId = otherUserId? otherUserId:userUid
                const propertyId = chatData.propertyId;
                const mensajes = Object.values(chatData.mensajes);
                const mensajesOrdenados = mensajes.sort((a, b) => {
                    return a.createdAt - b.createdAt;
                });

                const ultimoMensaje = mensajesOrdenados[mensajesOrdenados.length - 1];

                // Obtener información del usuario
                const userDoc = await firestore().collection("Users").doc(otherUserId).get();
                // Obtener información de la propiedad
                const propertyDoc = await firestore().collection("Properties").doc(propertyId).get();
                // Obtener la URL de la imagen de la propiedad
                const propertyImage = await getImagesUrls(propertyId);

                // Construir el objeto chatInfo con toda la información necesaria
                const chatInfo = {
                    id: chatKey,
                    otherUserId: userDoc.id,
                    otherUserInfo: userDoc.data(),
                    propertyData: propertyDoc.data(),
                    propertyImage: propertyImage,
                    lastMessage: ultimoMensaje
                };
                chatsData.push(chatInfo);
            }));
            setChats(chatsData);
        };

        const listener = (snapshot) => fetchData(snapshot);

        chatsRef.on("value", listener);

        return () => {
            chatsRef.off("value", listener);
        };
    }, []);
    const getImagesUrls = async propertyId => {
        try {
            const reference = storage().ref(`images/${propertyId}`);
            const listResult = await reference.list();
            const firstImageRef = listResult.items[0];
            if (firstImageRef) {
                return await firstImageRef.getDownloadURL();
            } else {
                return '';
            }
        } catch (error) {
            console.error('Error al cargar la URL de la primera imagen:', error);
        }
    }

    const renderItem = ({ item }) => (
        <ShowMessage
            onPress={() => navigation.push('Chat', { userId: item.otherUserId, userPic: item.otherUserInfo.photoURL })}
            submitter={item.otherUserInfo.name}
            address={item.propertyData.address}
            imageProperty={item.propertyImage}
            imageSubmitter={item.otherUserInfo.photoURL}
            message={item.lastMessage.text}
            inboxTime={item.lastMessage.createdAt}
            isSentMessage={auth().currentUser.uid === item.lastMessage.user._id}
        />

    );

    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
            <Text style={style.screenTitle}>Mensajes</Text>
            <ShowMessageChatbot
                onPress={() => navigation.push('ChatBotAI', { userId: 2 })}
            />
            <FlatList
                data={chats}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={{ flex: 1, minHeight: 0 }}
            />
        </View>
    );
}

export default Message;