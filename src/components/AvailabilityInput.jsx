import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const AvailabilityInput = ({ onValueChange, value }) => {
    const [selectedDate, setSelectedDate] = useState({ date: null, isAvailableNow: false });
    const [showCalendar, setShowCalendar] = useState(false);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (value) {
            setSelectedDate(value);
            setSelectedOption(value.isAvailableNow ? 'isAvailableNow' : 'date');
        }
    }, [value]);

    const handleSelectDate = (date) => {
        setSelectedDate({ date, isAvailableNow: false });
        setSelectedOption('date');
        onValueChange({ date, isAvailableNow: false });
    };

    const handleSelectNow = () => {
        setSelectedDate({ date: null, isAvailableNow: true });
        setSelectedOption('isAvailableNow');
        onValueChange({ date: null, isAvailableNow: true });
        setShowCalendar(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleSelectNow} style={[styles.option, selectedOption === 'isAvailableNow' && styles.selectedOption]}>
                    <View style={[styles.circle, selectedOption === 'isAvailableNow' && styles.selectedCircle]}></View>
                    <Text style={styles.optionText}>Disponible ahora</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowCalendar(true)} style={[styles.option, selectedOption === 'date' && styles.selectedOption]}>
                    <View style={[styles.circle, selectedOption === 'date' && styles.selectedCircle]}></View>
                    <Text style={styles.optionText}>Seleccionar fecha</Text>
                </TouchableOpacity>
            </View>

            {showCalendar && (
                <View style={{ flex: 1 }}>
                    <Calendar
                        minDate={minDate}
                        onDayPress={(day) => handleSelectDate(day)}
                        markedDates={selectedDate.date ? { [selectedDate.date.dateString]: { selected: true } } : {}}
                        theme={{
                            textSectionTitleColor: '#0f1035',
                            todayTextColor: '#7B286A',
                            selectedDayBackgroundColor: '#0f1035',
                            monthTextColor: '#0f1035',
                            arrowColor: '#0f1035'
                        }}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
        paddingLeft: '5%'
    },
    selectedOption: {
        backgroundColor: 'white',
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        marginRight: 10,
        borderWidth: 2,
        borderColor: '#e6e6e6'
    },
    selectedCircle: {
        backgroundColor: '#0f1035',
    },
    optionText: {
        fontSize: 16,
    },
});

export default AvailabilityInput;