import React, { memo, useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import { emailValidator, passwordValidator } from '../../core/validators';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import styles from './styles';
import LoginDto from '../../services/authentication/authentication/dtos/LoginDto';
import AuthenticationService from '../../services/authentication/authentication/AuthenticationService';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  handleLogin: (accessToken: string) => void;
};

const Login = ({ navigation, handleLogin }: Props) => {

  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });

  const authenticationService = new AuthenticationService();

  const handleLoginClick = async () => {
    if (!validateForm()) {
      return;
    }

    const loginDto = new LoginDto(email.value, password.value);
    const accessToken = await authenticationService.loginAsync(loginDto);
    handleLogin(accessToken);
  };

  const validateForm = (): boolean => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError)
      setEmail({ ...email, error: emailError });

    if (passwordError)
      setPassword({ ...password, error: passwordError });

    const isValid = !email.error && !password.error;

    return isValid;
  };

  return (
    <Background>
      <Logo />

      <Header>Entrar</Header>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Senha"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry={true}
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity onPress={() => navigation.navigate('Recovery')}>
          <Text style={styles.label}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={handleLoginClick}>
        Entrar
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Não tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.link}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default memo(Login);