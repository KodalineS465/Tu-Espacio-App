
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';

const ShowFinishedAuction = ({onPress, property}) => {
    const expiresAtDate = property.expiresAt instanceof Date ? property.expiresAt : property.expiresAt.toDate();
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.leftContainer}>
                <View style={styles.containerImage}>
                    <View style={styles.imageContainerPerson}>
                        <Image
                            source={property.latestAuction && property.latestAuction.offers.length > 0 ? { uri: property.latestAuction.offers[property.latestAuction.offers.length - 1].user.photoURL } : require("../assets/nobody.png")}
                            style={styles.image}
                        />
                    </View>
                    <View style={[styles.imageContainerHouse, {marginLeft: -30 }]}>
                        <Image
                            source={{uri: property.propertyImage}}
                            style={styles.image}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.centerContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.textLeader} numberOfLines={3}>
                        {property.latestAuction && property.latestAuction.offers.length > 0 ?
                            "Ganador: " + property.latestAuction.offers[property.latestAuction.offers.length - 1].user.name : "No hubo suerte "}
                    </Text>
                    <View style={styles.buttonContainer}>
                        <View style={styles.servicesContainer}>
                            <Text style={styles.textShow}>
                                {property.latestAuction? property.latestAuction.offers.length > 0 ?
                                    property.latestAuction.offers[property.latestAuction.offers.length - 1].amount : property.latestAuction.price: " :( "}
                            </Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.textAddress} numberOfLines={1}>Propiedad: {property.address}</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.textLastOffer}>Subasta terminada el: {expiresAtDate.toLocaleDateString()}</Text>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <Image
                    source={require('../assets/right.png')}
                    style={styles.icon}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    containerImage: {
        flexDirection: 'row',
    },
    imageContainerPerson: {
        margin: 5,
        borderRadius: 100,
        overflow: 'hidden',
        position: 'relative',
        borderColor: 'black',
        borderWidth: 2
    },
    imageContainerHouse: {
        margin: 5,
        borderRadius: 100,
        overflow: 'hidden',
        position: 'relative',
        borderColor: 'black',
        borderWidth: 2
    },
    container: {
        flexDirection: 'row',
        width: '100%',
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: 2,
        paddingVertical: 5,
        paddingHorizontal: 5
    },
    leftContainer: {
        backgroundColor: 'white',
        paddingVertical: 10,
        width: '35%'
    },
    centerContainer: {
        backgroundColor: 'white',
        width: '60%',
        height: 'auto',
        justifyContent: 'center',
        paddingVertical: 5,
    },
    rightContainer: {
        backgroundColor: 'white',
        width: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto'
    },
    textContainer: {
        flexDirection: 'row',
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
        backgroundColor: '#0f1035',
        width: 'auto',
        borderRadius : 3,
        paddingHorizontal: 3
    },
    image: {
        width: 65,
        height: 65,
        opacity: 1
    },
    textAddress: {
        color: 'gray',
        fontSize: 14,
        fontWeight: 'bold'
    },
    textLeader: {
        color: '#0f1035',
        fontSize: 14,
        paddingTop: 5,
        paddingRight: 5
    },
    textLastOffer: {
        color: '#0f1035',
        fontWeight: 'bold',
        fontSize: 14,
    },
    textTimeLeft: {
        color: '#0f1035',
        fontSize: 14,
    },
    textShow:{
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    icon: {
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ShowFinishedAuction;