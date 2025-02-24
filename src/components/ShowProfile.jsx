import React, { useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { supabase } from '../../lib/supabase';

const ShowProfile = () => {
    const [userInfo, setUserInfo] =useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user: ', error.message);
            } else {
                setUserInfo(user);
            }
        };
        fetchUser();
    }, []);

    if (!userInfo) {
        return <Text>Cargando perfil...</Text>;
    }

    const nameParts = userInfo.user_metadata?.full_name?.split(' ') || ['Usuario'];
    const firstName = nameParts[0];
    const image = userInfo.user_metadata?.avatar_url;

    return (
        <View style={styles.big}>
            <View style={styles.container}>
                <View style={styles.squareContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={image ? { uri: image } : require("../assets/profile.png")}
                            style={styles.image}
                        />
                    </View>
                    <Text style={styles.centerText}>{firstName}</Text>
                </View>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{userInfo.user_metadata?.full_name || 'Nombre no disponible'}</Text>
                <Text style={styles.text}>{userInfo.email}</Text>
                <Text style={styles.text}>{userInfo.email_confirmed ? 'Correo verificado' : 'Correo no verificado'}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: 15,
        justifyContent: 'center',
    },
    big: {
        justifyContent: 'center',
        height: "100%",
        backgroundColor: "#0f1035"
    },
    squareContainer: {
        width: 300,
        height: 250,
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: 'black',
        borderWidth: 2
    },
    centerText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 25,
        fontWeight: 'bold',
        color: '#0f1035'
    },
    textContainer: {
        paddingLeft: 60,
        paddingTop: 15,
    },
    text: {
        fontSize: 20,
        color: 'white',
        marginTop: 10,
    },
});

export default ShowProfile;
