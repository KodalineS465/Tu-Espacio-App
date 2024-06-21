
import React, {useEffect} from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, } from 'react-native';
import DivisionLine from "./DivisionLine";

const AuctionHistory = ({ property, navigation}) => {
    const expiresAtDate = property.expiresAt instanceof Date ? property.expiresAt : property.expiresAt.toDate();
    return (
        <View style={styles.mainContainer}>
            <View style={styles.imageContainerProperty}>
                <Image
                    source={{uri: property.propertyImage}}
                    style={[styles.mainImage, styles.rectangularImage]}
                />
            </View>
            <View style={styles.rowContainer}>
                <Text style={styles.textAddress} numberOfLines={1}>{property.address}</Text>
                <Text style={styles.textTimeLeft}>Termino el: {expiresAtDate.toLocaleDateString()}</Text>
            </View>
            <DivisionLine />
            {property.latestAuction !== null&& property.latestAuction.offers && property.latestAuction.offers.length > 0 && property.latestAuction.offers.map((offer, index) => {
                const offerDate = offer.date instanceof Date ? offer.date : offer.date.toDate(); // Convertir el timestamp de Firebase a un objeto Date
                return (
                    <TouchableOpacity
                        style={styles.container}
                        key={index}
                        onPress={() =>{
                            console.log(offer.id)
                            navigation.navigate("Home", {
                                screen: "MessageTab",
                                params: {
                                    screen: "Message" ,
                                    params: {userId: offer.id, propertyId: property.id}
                                }
                            })
                    }}>
                        <View style={styles.leftContainer}>
                            <View style={styles.containerImage}>
                                <View style={styles.imageContainerPerson}>
                                    <Image
                                        source={{uri: offer.user.photoURL}}
                                        style={styles.image}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.centerContainer}>
                            <Text style={styles.bigBlackText}>{offer.user.name}</Text>
                            <Text style={styles.blackText}>Oferta realizada: {offerDate.toLocaleTimeString()}</Text>
                            <Text style={styles.blackText}>{offerDate.toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.rightContainer}>
                            <Text style={styles.boldText}>Oferta: </Text>
                            <View style={styles.buttonContainer}>
                                <View style={styles.servicesContainer}>
                                    <Text style={styles.textShow}>{offer.amount}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white'
    },
    rowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        padding: 10
    },
    containerImage: {
        flexDirection: 'row',
        padding: 10
    },
    imageContainerPerson: {
        margin: 5,
        borderRadius: 100,
        overflow: 'hidden',
        position: 'relative',
        borderColor: 'black',
        borderWidth: 2
    },
    imageContainerProperty: {
        width: "100%",
    },
    container: {
        flexDirection: 'row',
        width: '100%',
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 2
    },
    leftContainer: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: '30%'
    },
    centerContainer: {
        backgroundColor: 'white',
        width: '45%',
        paddingTop: 25
    },
    rightContainer: {
        backgroundColor: 'white',
        width: '25%',
        paddingTop: 50,
        paddingLeft: 5,
        paddingRight: 5
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
    },
    mainImage: {
        width: "100%",
    },
    rectangularImage: {
        aspectRatio: 16 / 9,
        width: '100%',
        height: undefined,
    },
    image: {
        width: 70,
        height: 70,
        opacity: 1
    },
    bigBlackText: {
        color: 'black',
        fontSize: 18,
    },
    blackText: {
        color: 'black',
        fontSize: 16,
    },
    boldText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 3
    },
    textShow: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    textTimeLeft: {
        color: 'black',
        fontSize: 16,
    },
    textAddress: {
        color: 'gray',
        fontSize: 16,
    }
});

export default AuctionHistory;
