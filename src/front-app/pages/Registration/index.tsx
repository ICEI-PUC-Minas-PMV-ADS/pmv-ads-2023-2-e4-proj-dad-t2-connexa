import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import { ParamListBase, NavigationProp } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import styles from './styles';
import DropDownPicker from '../../components/DropDownPicker';

import {
  emailValidator,
  passwordValidator,
  nameValidator,
  passwordConfirmValidator,
  documentValidator,
  secretQuestionValidator,
  secretAnswerValidator,
  birthdateValidator,
} from '../../core/validators';


type Props = {
  navigation: NavigationProp<ParamListBase>;
};


const Registration = ({ navigation }: Props) => {

  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [document, setDocument] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [passwordConfirm, setPasswordConfirm] = useState({ value: '', error: '' });
  const [secretQuestion, setSecretQuestion] = useState({ value: '', error: '' });
  const [secretAnswer, setSecretAnswer] = useState({ value: '', error: '' });
  const [birthdate, setBirthdate] = useState({ value: null, error: '' });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Qual é o nome do seu primeiro animal de estimação?', value: 'Qual é o nome do seu primeiro animal de estimação?' },
    { label: 'Qual é o nome da sua mãe?', value: 'Qual é o nome da sua mãe?' },
    { label: 'Qual é o nome da sua cidade natal?', value: 'Qual é o nome da sua cidade natal?' },
    { label: 'Qual é o seu prato de comida favorito?', value: 'Qual é o seu prato de comida favorito?' },
    { label: 'Qual é o nome do seu melhor amigo de infância?', value: 'Qual é o nome do seu melhor amigo de infância?' },
    { label: 'Qual é a sua cor favorita?', value: 'Qual é a sua cor favorita?' },
    { label: 'Qual é o seu filme favorito?', value: 'Qual é o seu filme favorito?' },
    { label: 'Qual é a data de aniversário da sua avó?', value: 'Qual é a data de aniversário da sua avó?' },
    { label: 'Qual é o nome do seu professor favorito?', value: 'Qual é o nome do seu professor favorito?' },
    { label: 'Qual é o modelo do seu primeiro carro?', value: 'Qual é o modelo do seu primeiro carro?' }
  ]);

  const handleSecretQuestionSelect = (selectedQuestion: string) => {
    const secretQuestionError = secretQuestionValidator(selectedQuestion);
    setSecretQuestion({ value: selectedQuestion, error: secretQuestionError });
  };

  const handleRegistrationClick = () => {
    if (!validateForm()) {
      return;
    }

    return;
  };

  const validateForm = (): boolean => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const documentError = documentValidator(document.value);
    const passwordError = passwordValidator(password.value);
    const passwordConfirmError = passwordConfirmValidator(password.value, passwordConfirm.value);
    const secretQuestionError = secretQuestionValidator(secretQuestion.value);
    const secretAnswerError = secretAnswerValidator(secretAnswer.value);
    const birthdateError = birthdateValidator(birthdate.value);

    setName({ ...name, error: nameError });
    setEmail({ ...email, error: emailError });
    setDocument({ ...document, error: documentError });
    setPassword({ ...password, error: passwordError });
    setPasswordConfirm({ ...passwordConfirm, error: passwordConfirmError });
    setSecretQuestion({ ...secretQuestion, error: secretQuestionError });
    setSecretAnswer({ ...secretAnswer, error: secretAnswerError });
    setBirthdate({ ...birthdate, error: birthdateError });

    const isValid =
      !nameError &&
      !emailError &&
      !documentError &&
      !passwordError &&
      !passwordConfirmError &&
      !secretQuestionError &&
      !secretAnswerError &&
      !birthdateError;

    return isValid;
  };



  return (
    <Background>
      <BackButton goBack={navigation.goBack} />

      <Logo />

      <Header>Cadastrar</Header>

      <TextInput
        label="Nome Completo"
        returnKeyType="next"
        value={name.value}
        onChangeText={text => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />

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
        label="CPF"
        returnKeyType="next"
        value={document.value}
        onChangeText={text => setDocument({ value: text, error: '' })}
        error={!!document.error}
        errorText={document.error}
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

      <TextInput
        label="Confirmar Senha"
        returnKeyType="done"
        value={passwordConfirm.value}
        onChangeText={text => setPasswordConfirm({ value: text, error: '' })}
        error={!!passwordConfirm.error}
        errorText={passwordConfirm.error}
        secureTextEntry={true}
      />

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={'Pergunta Secreta'}
        listMode="MODAL"
        errorText={secretQuestion.error}
      />

      <TextInput
        label="Resposta Secreta"
        returnKeyType="next"
        value={secretAnswer.value}
        onChangeText={text => setSecretAnswer({ value: text, error: '' })}
        error={!!secretAnswer.error}
        errorText={secretAnswer.error}
      />

      <Button mode="contained" onPress={handleRegistrationClick} style={styles.button}>
        Cadastrar
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default memo(Registration);
