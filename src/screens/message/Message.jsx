import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { supabase } from '../../../supabase';
import ShowMessage from "../../components/ShowMessage";
import style from "../../components/Styles";
import ShowMessageChatbot from "../../components/ShowMessageChatbot";

const Message = ({ navigation, route }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (route.params) {
            const {userId, propertyId, userPic} = route.params;
            navigation.push("Chat", {userId: userId, propertyId: propertyId, userPic: userPic})
        }
    }, [route]);

    useEffect(() => {
        const fetchChats = async () => {
            const userUid = (await supabase.auth.getUser()).data.user.id;
            const { data, error } = await supabase
                .from("chats")
                .select("*, usuarios, propertyId, mensajes")
                .contains("usuarios", [userUid]);

            if (error) {
                console.error("Error fetching chats: ", error);
                return;
            }

            const chatsData = await Promise.all(data.map(async (chat) => {
                let otherUserId = chat.usuarios.find(id => id !== userUid) || userUid;
                const { data: userDoc } = await supabase.from("Users").select("*").eq("id", otherUserId).single();
                const { data: propertyDoc } =await supabase.from("Properties").select("*").eq("id", chat.propertyId).single();
                const propertyImage =  await getImagesUrls(chat.propertyId);
                const mensajesOrdenados = chat.mensajes.sort((a, b) => a.createdAt - b.createdAt);
                const ultimoMensaje = mensajesOrdenados[mensajesOrdenados.length - 1];
                return {
                    id: chat.id,
                    otherUserId: userDoc.id,
                    otherUserInfo: userDoc,
                    propertyData: propertyDoc,
                    propertyImage: propertyImage,
                    lastMessage: ultimoMensaje
                };
            }));
            setChats(chatsData);
        };

        fetchChats();
    }, []);

    const getImagesUrls = async (propertyId) => {
        const { data, error } = await supabase
            .storage
            .from("images")
            .list(`${propertyId}`);
        if (error || !data.length) return "";
        return supabase.storage.from("images").getPublicUrl(`${propertyId}/${data[0].name}`).data.publicUrl;
    };

    const renderItem = ({ item }) => (
        <ShowMessage
            onPress={() => navigation.push('Chat', { userId: item.otherUserId, userPic: item.otherUserInfo.photoURL })}
            submitter={item.otherUserInfo.name}
            address={item.propertyData.address}
            imageProperty={item.propertyImage}
            imageSubmitter={item.otherUserInfo.photoURL}
            message={item.lastMessage.text}
            inboxTime={item.lastMessage.createdAt}
            isSentMessage={supabase.auth.user().id === item.lastMessage.user._id}
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