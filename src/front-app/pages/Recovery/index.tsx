import React, { memo, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { emailValidator } from '../../core/validators';
import Background from '../../components/Background';
import BackButton from '../../components/BackButton';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { ParamListBase, NavigationProp } from '@react-navigation/native';
import styles from './styles';

type Props = {
    navigation: NavigationProp<ParamListBase>;
};

const Recovery = ({ navigation }: Props) => {
    const [email, setEmail] = useState({ value: '', error: '' });

    const _onSendPressed = () => {
        const emailError = emailValidator(email.value);

        if (emailError) {
            setEmail({ ...email, error: emailError });
            return;
        }

        navigation.navigate('LoginScreen');
    };

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />

            <Logo />

            <Header>Restore Password</Header>

            <TextInput
                label="E-mail address"
                returnKeyType="done"
                value={email.value}
                onChangeText={text => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />

            <Button mode="contained" onPress={_onSendPressed} style={styles.button}>
                Send Reset Instructions
            </Button>
        </Background>
    );
};

export default memo(Recovery);
