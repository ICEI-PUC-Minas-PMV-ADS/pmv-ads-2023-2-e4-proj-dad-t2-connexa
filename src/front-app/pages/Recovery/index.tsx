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
import Toast from 'react-native-toast-message';

type Props = {
    navigation: NavigationProp<ParamListBase>;
};

const Recovery = ({ navigation }: Props) => {
    const [email, setEmail] = useState({ value: '', error: '' });
    const [document, setDocument] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [passwordConfirm, setPasswordConfirm] = useState({ value: '', error: '' });
    const [secretQuestion, setSecretQuestion] = useState({ value: '', error: '' });
    const [secretAnswer, setSecretAnswer] = useState({ value: '', error: '' });

    const [disableInputs, setDisableInputs] = useState(true);


    const handleEmailValidation = async () => {

        if (!validateEmailFromForm())
            return;

        try {
            const authenticationService = new AuthenticationService();
            const secretQuestionResponse = await authenticationService.getSecretQuestionAsync(email.value);

            if (!secretQuestionResponse) {
                Toast.show({ type: 'error', text1: 'Usuário não encontrado.' });
                return;
            }

            setSecretQuestion({ value: secretQuestionResponse, error: '' });

            setDisableInputs(false);

        } catch (error) {
            console.error('Recovery.handleContinueClick -> Erro ao buscar pergunta secreta:', error);
            Toast.show({ type: 'error', text1: 'Erro ao buscar usuário, tente novamente mais tarde.' });
        }
    };

    const validateEmailFromForm = () => {
        const emailError = emailValidator(email.value);
        setEmail({ ...email, error: emailError });
        return !emailError;
    }

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
        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
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

                {disableInputs &&
                    <Button mode="contained" onPress={handleEmailValidation} style={styles.button}>
                        Prosseguir
                    </Button>
                }

                {!disableInputs &&
                    <>
                        <TextInput
                            label="CPF"
                            returnKeyType="next"
                            value={document.value}
                            onChangeText={text => setDocument({ value: text, error: '' })}
                            error={!!document.error}
                            errorText={document.error}
                        />

                        <TextInput
                            label={"Pergunta secreta"}
                            value={secretQuestion.value}
                            editable={false}
                            multiline={true}
                            numberOfLines={3}
                            textBreakStrategy='simple'
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
                    </>
                }
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
