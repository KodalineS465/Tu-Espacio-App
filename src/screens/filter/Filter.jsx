import React, { useState } from 'react';
import {Text, ScrollView} from 'react-native';
import style from "../../components/Styles";
import OptionsButton from "../../components/OptionsButton";
import SoftLine from "../../components/SoftLine";

const Filter = () => {
    const [type, setType] = useState(null);
    const [bedrooms, setBedrooms] = useState(null);
    const [bathrooms, setBathrooms] = useState(null);
    const [parkingLots, setParkingLots] = useState(null);
    const [availability, setAvailability] = useState({ date: null, isAvailableNow: true});
    const [oldness, setOldness] = useState(null);

    const optionsType = ['Casa', 'Duplex', 'Casa en condominio', 'Departamento compartido', 'Departamento',
        'Local en centro comercial', 'Local comercial','Bodega comercial', 'Oficina', 'Edificio', 'Otro'];
    const optionsOldness = ['A estrenar', '1 año', '2 años', '3 años', '4 años', 'De 5 a 10 años', 'De 10 a 20 años',
        'De 20 a 30 años', 'De 30 a 40 años', 'Mas de 50 años'];


    const handleBedrooms = (value) => {
        setBedrooms(value);
        console.log(value)
    };

    const handleBathrooms = (value) => {
        setBathrooms(value);
        console.log(value)
    };

    const handleParkingLots = (value) => {
        setParkingLots(value);
        console.log(value)
    };

    const handleAvailabilityChange = (value) => {
        setAvailability(value);
    };

    const handleServices = (option) => {
        console.log('Servicio seleccionado:', option);
        setServices(option);
    };

    const handleAmenities = (option) => {
        console.log('Amenidad seleccionada:', option);
        setAmenities(option);
    };


    return (
        <ScrollView style={style.screenContainer}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>

            <Text style={style.filterText} >Tipo de inmueble</Text>
            <OptionsButton
                text={type || "¿Cual es tu espacio deseado?"}
                options={optionsType}
                onSelect={setType}
            />
            <Text style={style.filterText} >Recamaras</Text>

            <OptionsButton
                text={oldness || "¿Que tan antigüo es tu espacio?"}
                options={optionsOldness}
                onSelect={setOldness}
            />
            <SoftLine />
        </ScrollView>
    );
};

export default Filter;
