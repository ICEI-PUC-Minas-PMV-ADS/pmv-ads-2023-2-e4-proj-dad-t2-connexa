import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import Picker from 'react-native-dropdown-picker';

type Props = React.ComponentProps<typeof Picker> & { errorText?: string };

const DropDownPicker = ({ errorText, ...props }: Props) => {
  return (
    <View style={styles.container}>
      <Picker
        style={errorText && !props.open ? styles.inputError : styles.input}
        textStyle={errorText && !props.open ? styles.inputTextStyleError : styles.inputTextStyle}
        {...props}
      />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
};

export default DropDownPicker;




