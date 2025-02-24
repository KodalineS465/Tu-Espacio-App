import { View, Text, StyleSheet, TextInput } from 'react-native';

const PriceInput = ({value, onChangeText}) => {

    const handleBlur = () => {
        console.log('Precio guardado automaticamente:', value);
    };
    return (
        <View style={styles.container}>
            <View style={styles.buttonsRow}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>MXN</Text>
                </View>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={value}
                    keyboardType="numeric"
                    placeholder="Precio inicial de subasta"
                    onBlur={handleBlur}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 2,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonsRow: {
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: 10,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: "#0f1035",
        width:50,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        marginRight: 0,
    },
    buttonText: {
        fontSize: 14,
        color: "white"
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#E6E6E6',
        borderWidth: 3,
        paddingHorizontal: 10,
        color: 'black',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: "white"
    },
    text:{
        marginLeft: 30,
        color: "#0f0135",
        fontSize: 14,
        marginBottom: 10,
        fontWeight: 'bold'
    }
});

export default PriceInput;