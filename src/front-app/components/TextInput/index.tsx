import React, { memo, useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import { theme } from '../../core/theme';
import styles from './styles';

type Props = React.ComponentProps<typeof Input> & { errorText?: string };

const TextInput = ({ errorText, secureTextEntry, ...props }: Props) => {

  const [showPassword, setShowPassword] = useState(false);

  const shouldHidePassword = () => {
    if (!secureTextEntry)
      return false;

      return !showPassword;;
  };

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        {...props}
        secureTextEntry={shouldHidePassword()}
        right={secureTextEntry ?
          <Input.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => {
              setShowPassword(!showPassword);
              return false;
            }}
          /> : null
        }
      />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
};

export default memo(TextInput);