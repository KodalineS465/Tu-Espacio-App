import React, { useState, useEffect } from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';

const ChatBotAI = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: '¡Hola! Soy tu asistente virtual personal. ¿En qué puedo ayudarte?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'ChatBot',
                },
            },
        ]);
    }, []);

    const onSend = async (messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const messageText = messages[0].text;

        try {
            const response = await fetch(`https://addmessage-lqfipvzxma-uc.a.run.app?text=${encodeURIComponent(messageText)}`);
            const data = await response.text();
            const newMessage = {
                _id: Math.round(Math.random() * 1000000),
                text: data,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'ChatBot',
                },
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: 'white',
                    },
                    left: {
                        backgroundColor: 'lightgray',
                    },
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
            <Image
                style={{width: 50, height: 50, borderRadius: 15, marginRight: 10 }}
                source={require('../../assets/bot-image.png')}
            />
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.containerHeader}>
                <View style={styles.containerText}>
                    <Text style={styles.heading}>Asistente Virtual</Text>
                    <Text style={styles.description}>Chatbot | ¿Cómo te puedo ayudar hoy?</Text>
                </View>
            </View>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                }}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolBar}
                renderAvatar={renderAvatar}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    containerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        backgroundColor: '#0f1035',
    },
    containerText: {
        alignItems: 'center',
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
        color: 'white'
    },
    description: {
        fontSize: 12,
        color: 'white'
    },
});

export default ChatBotAI;
