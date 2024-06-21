import React, { useState, useEffect } from 'react';
import {View, Text, Image, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity} from 'react-native';
import firestore from "@react-native-firebase/firestore";
const ShowMyFinishedAuctions = ({ auction, user, finishedDate, navigation }) => {
    const [message, setMessage] = useState('');
    useEffect(() => {
        console.log(auction.propertyId+ "----------------------------------------------------------------")
    }, []);
    useEffect(() => {
        if (auction.latestOffer && auction.latestOffer.id === user) {
            setMessage("¡Has ganado la subasta!");
        } else {
            setMessage("Has perdido la subasta");
        }
    }, [auction.latestOffer, user]);
    const expiresAtDate = finishedDate instanceof Date ? finishedDate : finishedDate.toDate();
    return (
        <TouchableOpacity style={styles.container}
                          onPress={()=>{
                              if (message === "¡Has ganado la subasta!"){
                                  navigation.navigate("Home", {
                                      screen: "MessageTab",
                                      params: {
                                          screen: "Message" ,
                                          params: {userId: auction.property.user, propertyId: auction.propertyId}
                                      }
                                  })
                              }
                          }}
        >
            <View style={styles.imageContainerProperty}>
                <Image
                    source={{ uri: auction.property.propertyImage }}
                    style={[styles.mainImage, styles.rectangularImage]}
                />
            </View>
            <View style={[styles.textContainer, message === 'Has perdido la subasta' ? styles.redBackground : null]}>
                <Text style={styles.mainText}>{message}</Text>
            </View>
            <View style={styles.textContainerBasic}>
                <Text style={styles.textAddress} numberOfLines={1}>
                    {auction.property.address}
                </Text>
                <View style={styles.rowContainer}>
                    <Text style={styles.textLastOffer}>Oferta ganadora: </Text>
                    <View style={styles.buttonContainer}>
                        <View style={styles.servicesContainer}>
                            <Text style={styles.textShow}>{auction.latestOffer.amount}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.textTimeLeft}>Subasta terminada el: {expiresAtDate.toLocaleDateString()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        padding: 10,
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 3,
        paddingTop: 30
    },
    imageContainerProperty: {
        width: "90%",
    },
    mainImage: {
        width: "100%",
    },
    rectangularImage: {
        aspectRatio: 16 / 9,
        width: '100%',
        height: undefined,
        borderColor: 'black',
        borderWidth: 2
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#0f1035',
        width: '90%'
    },
    redBackground: {
        backgroundColor: '#4D0303',
    },
    textContainerBasic: {
        marginBottom: 20,
        width: '90%'
    },
    mainText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    rowContainer: {
        flexDirection: 'row',
    },
    textAddress: {
        color: 'gray',
        fontSize: 16,
    },
    textLastOffer: {
        color: 'black',
        fontSize: 16,
        paddingTop: 5
    },
    buttonContainer: {
        width: 'auto',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    servicesContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: '#002D06',
        width: 'auto',
        borderRadius: 3
    },
    textShow: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    textTimeLeft: {
        color: 'black',
        fontSize: 16,
        paddingTop: 5,
        fontWeight: 'bold'
    },
});

export default ShowMyFinishedAuctions;