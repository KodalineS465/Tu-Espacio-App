import React from 'react';
import { View, Image, StyleSheet , Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CustomCarousel = ({ images }) => {
    const hasImages = images && images.length > 0;
    return (
        <View style={styles.container}>
            {hasImages ? (
                <Carousel 
                    loop
                    width={width}
                    height={250}
                    autoPlay={true}
                    data={images}
                    scrollAnimationDuration={1000}
                    renderItem={({ item }) => (
                        <View style={styles.slide}>
                            <Image
                                source={{ uri: item }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>
                    )}
                />
            ) : (
                <Image
                    source={require('../assets/not-image.png')}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 250,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: '100%'
    },
});

export default CustomCarousel;