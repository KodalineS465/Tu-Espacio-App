import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SurfaceInput = ({ surfaceType, setSurfaceType, unit, setUnit, quantity, setQuantity }) => {

    const handleSurfaceTypeChange = (type) => {
        setSurfaceType(type);
        console.log('Tipo de propiedad guardado:', type);
    };

    const handleUnitChange = (selectedUnit) => {
        setUnit(selectedUnit);
        console.log('Unidad seleccionada guardada:', selectedUnit);
    };

    const handleQuantityChange = (text) => {
        setQuantity(text);
        console.log('Cantidad exacta guardada:', text);
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <TouchableOpacity
                    style={[styles.button, surfaceType === 'Construido' ? styles.activeButton : null]}
                    onPress={() => handleSurfaceTypeChange('Construido')}
                >
                    <Text style={[styles.buttonText, surfaceType === 'Construido' ? styles.activeText : null]}>Construido</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, surfaceType === 'Terreno' ? styles.activeButton : null]}
                    onPress={() => handleSurfaceTypeChange('Terreno')}
                >
                    <Text style={[styles.buttonText, surfaceType === 'Terreno' ? styles.activeText : null]}>Terreno</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <TouchableOpacity
                    style={[styles.buttonCircle, unit === 'Hectáreas' ? styles.activeButton : null]}
                    onPress={() => handleUnitChange('Hectáreas')}
                >
                    <Text style={[styles.buttonText, unit === 'Hectáreas' ? styles.activeText : null]}>ha</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.buttonCircle, unit === 'Metros Cuadrados' ? styles.activeButton : null]}
                    onPress={() => handleUnitChange('Metros Cuadrados')}
                >
                    <Text style={[styles.buttonText, unit === 'Metros Cuadrados' ? styles.activeText : null]}>m²</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={quantity}
                    onChangeText={handleQuantityChange}
                    placeholder="Cantidad exacta"
                    keyboardType="numeric"
                    onBlur={() => {
                        console.log('Información guardada:', quantity);
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
        width: '90%'
    },
    button: {
        width: '50%',
        height: 40,
        paddingVertical: 5,
        paddingLeft: 55,
        backgroundColor: 'white',
        borderRadius: 5,
        borderColor: '#e6e6e6',
        borderWidth: 3,
        justifyContent: 'center',
    },
    activeButton: {
        backgroundColor: '#0f1035',
        color: 'white',
    },
    buttonText: {
        color: 'gray',
    },
    input: {
        height: 40,
        borderColor: '#e6e6e6',
        borderWidth: 3,
        paddingHorizontal: 10,
        marginBottom: 10,
        width: '73%',
        borderRadius: 5,
        fontSize: 14
    },
    activeText: {
        color: 'white',
    },
    buttonCircle: {
        width: 40,
        height: 40,
        paddingVertical: 5,
        backgroundColor: 'white',
        marginRight: 10,
        borderRadius: 90,
        borderColor: '#e6e6e6',
        borderWidth: 3,
        alignItems: 'center'
    }
});

export default SurfaceInput;