import {StyleSheet, View, Text} from "react-native";
import React from "react";

const Scale = ({since, mid, from}) => {

    return(
        <View style={styles.container}>
            <View style={styles.bar}>
                <View style={styles.miniLeftLine} />
                <View
                    style={styles.leftCircle}
                />
                <View style={styles.leftLine} />
                <View
                    style={styles.midCircle}
                />
                <View style={styles.rightLine} />
                <View
                    style={styles.rightCircle}
                />
                <View style={styles.miniRightLine} />
            </View>
            <View style={styles.textContainer2}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>${since}</Text>
                    <Text style={styles.text}>${mid}</Text>
                    <Text style={styles.text}>${from}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "70%",
        paddingHorizontal: 10
    },
    textContainer2: {
        alignItems: 'center',
        justifyContent: "center"
    },
    bar: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "70%",
        borderRadius: 5,
    },
    miniLeftLine: {
        height: 5,
        width: 10,
        backgroundColor: 'yellow',
        borderRadius: 5
    },
    miniRightLine: {
        height: 5,
        width: 10,
        backgroundColor: 'red',
        borderRadius: 5
    },
    leftLine: {
        flex: 1,
        height: 5,
        backgroundColor: 'lightgreen',
        borderRadius: 5
    },
    rightLine: {
        flex: 1,
        height: 5,
        backgroundColor: 'orange',
        borderRadius: 5
    },
    leftCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    midCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    rightCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    text: {
        color: "white",
        paddingHorizontal: 35
    },
});

export default Scale;