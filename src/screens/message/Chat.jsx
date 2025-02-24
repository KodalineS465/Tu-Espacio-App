import React, { useState, useCallback, useEffect } from 'react'
import { supabase } from '../../../supabase';
import {Bubble, GiftedChat, InputToolbar} from 'react-native-gifted-chat'
import { Image, View } from "react-native";

const Chat = ({ route }) => {
    const { userId, propertyId, userPic } = route.params;
    const [mensajes, setMensajes] = useState([]);
    const [chatId, setChatId] = useState(null);

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const { data: chats, error } = await supabase
                    .from('chats')
                    .select('*')
                    .contains('usuarios', [userId, supabase.auth.user().id]);

                if (error) throw error;

                if (chats.length > 0) {
                    setChatId(chats[0].id);
                    setMensajes(chats[0].mensajes || []);
                } else {
                    const { data: newChat, error: newChatError } = await supabase
                        .from('chats')
                        .insert([{
                            usuarios: [supabase.auth.user().id, userId],
                            mensajes: [],
                            propertyId
                        }])
                        .select('*');

                    if (newChatError) throw newChatError;
                    setChatId(newChat[0].id);
                }
            } catch (error) {
                console.error('Error fetching chat: ', error);
            }
        };

        fetchChat();
    }, []);

    const onSend = useCallback(async (messages = []) => {
        if (!chatId) return;

        const messageObject = messages[0];
        const newMessage = {
            _id: messageObject._id,
            text: messageObject.text,
            createdAt: messageObject.createdAt.getTime(),
            user: {
                _id: messageObject.user._id,
                name: messageObject.user.name,
            },
        };

        try {
            const { error } = await supabase
                .from('chats')
                .update({ mensajes: [...mensajes, newMessage] })
                .eq('id', chatId);

            if (error) throw error;
            setMensajes(previousMessages => GiftedChat.append(previousMessages, messages));
        } catch (error) {
            console.error('Error sending message: ', error);
        }
    }, [chatId, mensajes]);

    const renderBubble = (props) => (
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

    const renderInputToolBar = (props) => (
            <InputToolbar
                {...props}
                containerStyle={{
                    backgroundColor: 'white',
                }}
                placeholder="Escriba aqui"
                placeholderTextColor="black"
            />
        );

    const renderAvatar = () => (
            <View
                style={{backgroundColor: "#0f1035", width: 50, height: 50, borderRadius: 15, marginRight: 10 }}
            />
        );

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