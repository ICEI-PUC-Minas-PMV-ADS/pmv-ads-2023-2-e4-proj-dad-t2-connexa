import React, { memo, useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import { theme } from '../../core/theme';
import styles from './styles';
import { TextInputMask } from 'react-native-masked-text';

type Props = React.ComponentProps<typeof Input> & { errorText?: string };

const DocumentInput = ({ errorText, secureTextEntry, ...props }: Props) => {

  const documentInputRef = React.createRef<TextInputMask>();

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        {...props}
        render={props =>
          <TextInputMask
            type={'cpf'}
            {...props}
            ref={documentInputRef}
          />
        }
      />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
};

export default memo(DocumentInput);