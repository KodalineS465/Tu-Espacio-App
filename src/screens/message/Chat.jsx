import React, { useState, useCallback, useEffect } from 'react'
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import {Bubble, GiftedChat, InputToolbar} from 'react-native-gifted-chat'
import {Image, View} from "react-native";

const Chat = ({ route }) => {
    const { userId, propertyId, userPic } = route.params;
    const [mensajes, setMensajes] = useState([]);
    var chatId

    useEffect(() => {
        const ref = database().ref("chats");
        ref.orderByChild(`usuarios/${auth().currentUser.uid}`).equalTo(true).on("value", function (snapshot) {
            var chatEncontrado = false;
            snapshot.forEach(function (chatSnapshot) {
                var usuariosChat = chatSnapshot.child("usuarios").val();
                if (usuariosChat.hasOwnProperty(`${userId}`)) {
                    chatEncontrado = true;
                    chatId = chatSnapshot.key;
                    const mensajesChat = chatSnapshot.child("mensajes").val();
                    const mensajesOrdenados = Object.values(mensajesChat || {}).sort((a, b) => b.createdAt - a.createdAt); // Cambiado el orden
                    setMensajes(mensajesOrdenados);
                }
            });

            if (!chatEncontrado) {
                var newChatRef = database().ref("chats").push();
                newChatRef.set({
                    usuarios: {
                        [auth().currentUser.uid]: true,
                        [userId]: true
                    },
                    mensajes: {},
                    propertyId: propertyId
                });
            }
        });

        return () => ref.off();
    }, []);
    const onSend = useCallback((messages = []) => {
        const messageObject = messages[0];
        const newMessageRef = database().ref(`chats/${chatId}/mensajes`).push();
        const message = {
            _id: newMessageRef.key,
            text: messageObject.text,
            createdAt: messageObject.createdAt.getTime(),
            user: {
                _id: messageObject.user._id,
                name: messageObject.user.name,
            },
        };
        newMessageRef.set(message);
    }, [chatId]);

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        marginLeft: 0,
                        backgroundColor: 'lightgray',
                    },
                    right: {
                        backgroundColor: 'white',
                    }
                }}
                textStyle={{
                    left: {
                        color: 'black',
                    },
                    right: {
                        color: 'black',
                    }
                }}
                timeTextStyle={{
                    left: {
                        color: 'black',
                    },
                    right: {
                        color: 'black',
                    }
                }}
            />
        );
    };

    const renderInputToolBar = (props) => {
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    backgroundColor: 'white',
                }}
                placeholder="Escriba aqui"
                placeholderTextColor="black"
            />
        );
    };

    const renderAvatar = () => {
        return (
            <View
                style={{backgroundColor: "#0f1035", width: 50, height: 50, borderRadius: 15, marginRight: 10 }}
            />
        );
    };

    return (
        <GiftedChat
            messages={mensajes}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth().currentUser.uid,
            }}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolBar}
            renderAvatar={renderAvatar}
        />
    );
}

export default Chat;