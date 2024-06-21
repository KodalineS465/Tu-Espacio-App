import React, {useState} from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import OrderBy from "./OrderBy";

const OrderHeader = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };
    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <OrderBy visible={modalVisible} onClose={handleCloseModal} />
            <View style={styles.rightContainer}>
                <TouchableOpacity  onPress={handleOpenModal}>
                    <Image
                        source={require('../assets/order.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
    },
    rightContainer: {
        alignItems: 'flex-end',
    },
    logo: {
        width: 65,
        height: 65,
        marginLeft: 20
    },
    image: {
        width: 30,
        height: 30,
        marginRight: 5
    }
});


export default OrderHeader;