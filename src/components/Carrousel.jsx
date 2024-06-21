import React from 'react';
import { View, Image, StyleSheet , Text} from 'react-native';
import Swiper from 'react-native-swiper';

const Carousel = ({ images }) => {
    const hasImages = images && images.length > 0;
    return (
        <View style={styles.container}>
            {hasImages ? (
                <Swiper style={styles.wrapper} showsButtons={true}
                        prevButton={<Text style={{ color: 'white', fontSize: 60 }}>‹</Text>}
                        nextButton={<Text style={{ color: 'white', fontSize: 60}}>›</Text>}
                        dotColor="lightgray"
                        activeDotColor="white"
                >
                    {images.map((url, index) => (
                        <View style={styles.slide} key={index}>
                            <Image
                                source={{uri: url}}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>
                    ))}
                </Swiper>
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
    wrapper: { },
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

export default Carousel;