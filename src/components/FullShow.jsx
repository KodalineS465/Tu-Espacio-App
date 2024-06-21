import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, Text, ScrollView, TouchableOpacity, Modal} from 'react-native';
import BlueButton from "./BlueButton";
import Carrousel from "./Carrousel";

const FullShow = ({property,user, onPress, remainingTime}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const firstName = user.name.split(' ')[0];

    function formatPrice(price) {
        const parts = price.toString().split('.');

        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return parts.join('.');
    }

    return (
        <View style={styles.blueContainer}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <Carrousel images={property.images}/>
                <View style={styles.whiteContainer}>
                    <View style={styles.centerRowContainer}>
                        <View style={styles.leftContainer}>
                            <Text style={styles.textBlue}>MXN {formatPrice(property.auction.price)}</Text>
                        </View>
                        <View style={styles.rightContainer}>
                            <Text style={styles.textBlack}>{property.auction.offers.length} ofertas</Text>
                        </View>
                    </View>
                    <View style={styles.centerRowContainer}>
                        <Image source={require('../assets/bed.png')}
                               style={styles.logo}/>
                        <Text style={styles.textBlack}>{property.rooms}</Text>
                        <Image source={require('../assets/toilet.png')}
                               style={styles.logo}/>
                        <Text style={styles.textBlack}>{property.bathrooms}</Text>
                        <Image source={require('../assets/car.png')}
                               style={styles.logo}/>
                        <Text style={styles.textBlack}>{property.parkingLots}</Text>
                        <Image source={require('../assets/surface.png')}
                               style={styles.logo}/>
                        {property.surfaceUnit === 'Hectáreas' ? (
                            <Text style={styles.textBlack}>{property.surfaceQuantity} ha</Text>
                        ) : (
                            <Text style={styles.textBlack}>{property.surfaceQuantity} m²</Text>
                        )}
                    </View>
                    <View style={styles.mainLineContainer}>
                        <View style={styles.lineContainer}>
                            <View style={styles.linea}></View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => {setModalVisible(true);}} style={styles.containerProfile}>
                        <View style={styles.contentContainerProfile}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{uri: user.photoURL}}
                                    style={styles.image}
                                />
                            </View>
                            <View style={styles.textContainerProfile}>
                                <View style={styles.rowContainer}>
                                    <Image
                                        source={user.emailVerified? require('../assets/user-verified.png'): require('../assets/not-verified-user.png')}
                                        style={styles.verifiedImage}
                                    />
                                    <Text style={styles.text}>{user.emailVerified ? "Cuenta verificada": "Cuenta no verificada"}</Text>
                                </View>
                                <Text style={styles.mainText}>{user.name}</Text>
                            </View>
                            <Image source={require('../assets/right.png')}
                                   style={styles.logo}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.mainLineContainer}>
                        <View style={styles.lineContainer}>
                            <View style={styles.linea}></View>
                        </View>
                    </View>
                    <View style={styles.rowCenterContainer}>
                        <Image source={require('../assets/oldness.png')}
                               style={styles.clockLogo}
                        />
                        <Text style={styles.textBold}>Antigüedad de la casa: {property.oldness}</Text>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>{property.description}</Text>
                    </View>
                    <View style={styles.mainLineContainer}>
                        <View style={styles.lineContainer}>
                            <View style={styles.linea}></View>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <Image source={require('../assets/location.png')}
                               style={styles.locationImage}
                        />
                        <View style={styles.leftContainer}>
                            <Text style={styles.textGray}>{property.fullAddress}</Text>
                        </View>
                    </View>
                    <View style={styles.mainLineContainer}>
                        <View style={styles.lineContainer}>
                            <View style={styles.linea}></View>
                        </View>
                    </View>

                    <View style={styles.centerRowContainer}>
                        <Image source={require('../assets/hourglass.png')}
                               style={styles.centerLogo}
                        />
                        <Text style={styles.textBlack}>Quedan {remainingTime}</Text>
                    </View>
                    <BlueButton text='Ofertar' onPress={onPress} />
                    <View style={styles.rowContainer}>
                        <Image source={require('../assets/available.png')}
                               style={styles.logo}
                        />
                        <Text style={styles.textBold}>Disponible a partir {property.availability.isAvailableNow ? "de ahora!" : "del " + property.availability.date.dateString}</Text>
                    </View>
                    <View style={styles.mainLineContainer}>
                        <View style={styles.lineContainer}>
                            <View style={styles.linea}></View>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <Image source={require('../assets/services.png')}
                               style={styles.logo}
                        />
                        <Text style={styles.textBold}>Servicios incluidos</Text>
                    </View>
                    <View style={styles.down}>
                        {property.services.map((service, index) => (
                            <View style={styles.buttonContainer} key={index + service}>
                                <View style={styles.servicesContainer}>
                                    <Text style={styles.textShow}>
                                        {service}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={styles.mainLineContainer}>
                        <View style={styles.lineContainer}>
                            <View style={styles.linea}></View>
                        </View>
                    </View>
                    <View style={styles.rowContainer}>
                        <Image source={require('../assets/amenities.png')}
                               style={styles.logo}
                        />
                        <Text style={styles.textBold}>Amenidades incluidas</Text>
                    </View>
                    <View style={styles.down}>
                        {property.amenities.map((amenity, index)=> (
                            <View style={styles.buttonContainer} key={index + amenity}>
                                <View style={styles.servicesContainer}>
                                    <Text style={styles.textShow}>{amenity}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                </View>
            </ScrollView>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.squareContainer}>
                                <View style={styles.imageUserContainer}>
                                    <Image
                                        source={{uri: user.photoURL}}
                                        style={styles.imageUser}
                                    />
                                </View>
                                <Text style={styles.centerText}>{firstName}</Text>
                            </View>
                            <View style={styles.textUserContainer}>
                                <Text style={styles.textUserBold}>Nombre</Text>
                                <Text style={styles.textUser}>{user.name}</Text>
                                <Text style={styles.textUserBold}>Correo</Text>
                                <Text style={styles.textUser}>{user.email}</Text>
                                <Text style={styles.textUserBold}>Verificado</Text>
                                <Text style={styles.textUser}>{user.emailVerified ? 'Sí ✓' : 'No ×'}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    blueContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: '#0f1035',
    },
    whiteContainer: {
        flex: 1,
        marginTop: 20,
        marginBottom: 20,
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: 'white',
    },
    centerRowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 20
    },
    leftContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 15
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    descriptionContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 8,
        backgroundColor: 'white'
    },
    mainLineContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 4
    },
    lineContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    containerProfile: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'white',
        backgroundColor: 'white'
    },
    contentContainerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        marginRight: 10,
    },
    textContainerProfile: {
        flex: 1
    },
    rowContainer: {
        flexDirection: 'row',
        paddingTop: 10,
    },
    rowCenterContainer: {
        flexDirection: 'row',
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    servicesContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: '#e6e6e6',
        width: '70%',
        borderRadius: 5
    },
    descriptionText: {
        fontSize: 16,
        color: 'black'
    },
    textGray: {
        color: 'gray',
        fontSize: 14
    },
    textBlack: {
        color: 'black',
        fontSize: 15
    },
    textBlue: {
        color: '#0f1035',
        fontSize: 18,
        fontWeight: 'bold'
    },
    mainText: {
        fontSize: 20,
        color: 'black'
    },
    text: {
        fontSize: 15,
        color: 'gray'
    },
    textBold: {
        fontSize: 15,
        color: '#0f1035',
        fontWeight: 'bold',
        paddingVertical: 5
    },
    textShow:{
        color: 'black',
        fontWeight: 'bold'
    },
    verifiedImage: {
        width: 20,
        height: 20,
        marginHorizontal: 5,
        alignItems: 'flex-start',
    },
    locationImage: {
        width: 30,
        height: 30,
        marginHorizontal: 5,
        alignItems: 'flex-start',
        marginLeft: 10
    },
    logo: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15
    },
    clockLogo: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 30
    },
    centerLogo: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    linea: {
        borderBottomColor: '#E6E6E6',
        borderBottomWidth: 2,
        marginTop: 5,
        marginBottom: 10,
        flex: 1
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    squareContainer: {
        width: 300,
        height: 250,
        backgroundColor: '#0f1035',
        borderColor: '#0f1035',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    imageUserContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageUser: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 2
    },
    centerText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    textUserContainer: {
        paddingTop: 15,
    },
    textUser: {
        fontSize: 18,
        color: 'black',
        marginTop: 10,
        textAlign: 'center',
    },
    textUserBold: {
        fontSize: 18,
        color: 'black',
        marginTop: 10,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    closeButton: {
        backgroundColor: "#0f1035",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    down: {
        width: '100%',
        paddingBottom: 10
    }
});

export default FullShow;