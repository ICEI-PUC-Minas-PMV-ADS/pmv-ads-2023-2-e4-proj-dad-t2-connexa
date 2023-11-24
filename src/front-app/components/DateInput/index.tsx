import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput as Input, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';

interface DateInputProps {
    label: string;
    value: Date | null;
    onChange: (date: Date | null) => void;
    errorText?: string;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, errorText, label }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <View style={[styles.container]}>
            <Input
                label={label}
                value={value ? value.toLocaleDateString() : ''}
                onFocus={() => setShowDatePicker(true)}
                error={errorText ? true : false} 
                underlineColor="transparent"
                mode="outlined"
                style={styles.input}
            />
            {showDatePicker && (
                <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        onChange(selectedDate || value);
                    }}
                />
            )}
              {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
        </View>
    );
};

export default DateInput;

