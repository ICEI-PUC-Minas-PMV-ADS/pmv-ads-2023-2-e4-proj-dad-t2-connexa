import React, { memo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Background from '../../components/Background';
import BackButton from '../../components/BackButton';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { ParamListBase, NavigationProp } from '@react-navigation/native';
import AuthenticationService from '../../services/authentication/authentication/AuthenticationService';
import { ScrollView } from 'react-native';
import styles from './styles';
import {
    documentValidator,
    emailValidator,
    passwordConfirmValidator,
    passwordValidator,
    secretAnswerValidator,
} from '../../core/validators';

type Props = {
    navigation: NavigationProp<ParamListBase>;
};

const Recovery = ({ navigation }: Props) => {
    const [email, setEmail] = useState({ value: '', error: '' });
    const [document, setDocument] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [passwordConfirm, setPasswordConfirm] = useState({ value: '', error: '' });
    const [secretQuestion, setSecretQuestion] = useState({ value: '' });
    const [secretAnswer, setSecretAnswer] = useState({ value: '', error: '' });

    const authenticationService = new AuthenticationService();

    const handleEmailValidation = async () => {
        const emailError = emailValidator(email.value);
        setEmail({ ...email, error: emailError });

        if (!emailError) {
            try {
                const secretQuestionResponse = await authenticationService.getSecretQuestionAsync(email.value);

                if (secretQuestionResponse && secretQuestionResponse.value) {
                    setSecretQuestion(secretQuestionResponse.value);
                }
            } catch (error) {
                console.error('Erro ao chamar o serviço para obter a pergunta secreta:', error);
            }
        }
    };

    const handlePasswordRecoveryClick = async () => {
        if (!validateForm()) {
            return;
        }
    };

    const validateForm = (): boolean => {
        const emailError = emailValidator(email.value);
        const documentError = documentValidator(document.value);
        const passwordError = passwordValidator(password.value);
        const passwordConfirmError = passwordConfirmValidator(password.value, passwordConfirm.value);
        const secretAnswerError = secretAnswerValidator(secretAnswer.value);

        setEmail({ ...email, error: emailError });
        setDocument({ ...document, error: documentError });
        setPassword({ ...password, error: passwordError });
        setPasswordConfirm({ ...passwordConfirm, error: passwordConfirmError });
        setSecretAnswer({ ...secretAnswer, error: secretAnswerError });

        const isValid =
            !emailError &&
            !documentError &&
            !passwordError &&
            !passwordConfirmError &&
            !secretAnswerError;

        return isValid;
    };

    return (
        <ScrollView>
            <Background>
                <BackButton goBack={navigation.goBack} />
                <Logo />
                <Header>Recuperar Senha</Header>
                <TextInput
                    label="Email"
                    returnKeyType="next"
                    value={email.value}
                    onChangeText={(text) => setEmail({ value: text, error: '' })}
                    error={!!email.error}
                    errorText={email.error}
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                />
                <Button mode="contained" onPress={handleEmailValidation} style={styles.button}>
                    Prosseguir
                </Button>

                <TextInput
                    label={`${secretQuestion.value}`}
                    value={secretQuestion.value}
                    editable={false}
                />

                <TextInput
                    label="Resposta Secreta"
                    returnKeyType="next"
                    value={secretAnswer.value}
                    onChangeText={(text) => setSecretAnswer({ value: text, error: '' })}
                    error={!!secretAnswer.error}
                    errorText={secretAnswer.error}
                />

                <TextInput
                    label="Nova Senha"
                    returnKeyType="done"
                    value={password.value}
                    onChangeText={(text) => setPassword({ value: text, error: '' })}
                    error={!!password.error}
                    errorText={password.error}
                    secureTextEntry={true}
                />

                <TextInput
                    label="Confirmar Senha"
                    returnKeyType="done"
                    value={passwordConfirm.value}
                    onChangeText={(text) => setPasswordConfirm({ value: text, error: '' })}
                    error={!!passwordConfirm.error}
                    errorText={passwordConfirm.error}
                    secureTextEntry={true}
                />
                <Button mode="contained" onPress={handlePasswordRecoveryClick} style={styles.button}>
                    Recuperar Senha
                </Button>

                <View style={styles.row}>
                    <Text style={styles.label}>Lembrou a senha? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.link}>Login</Text>
                    </TouchableOpacity>
                </View>
            </Background >
        </ScrollView >
    );
};

export default memo(Recovery);
