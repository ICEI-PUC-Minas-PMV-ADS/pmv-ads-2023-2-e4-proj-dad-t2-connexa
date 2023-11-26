import React, { useState } from 'react';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import { Modal, TouchableOpacity, View, Text} from 'react-native';
import { addUserLista } from '../../services/permission/PermissionService';
import Toast from 'react-native-toast-message';
import toastConfig from '../../core/toastConfig';
import styles from './styles';
import { useRoute } from '@react-navigation/native';

const AddParticipant = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  
  const route = useRoute();
  const [newUserLista, setNewUserLista] = useState({
    userEmail: email,
    listaId:  (route.params as any).listaId,
    userListaRole: 2
  });

  const handleSendEmail = async () => {
    newUserLista.userEmail = email
    let result = await addUserLista(newUserLista);

    if (result) {
      let type = "error"
      let text1 = "Não adicionado"
      if (result.includes("Usuário adicionado a lista de permissões")) {
        type = "success"
        text1 = "Adicionado com sucesso"
      }
      Toast.show({ type: type, text1: text1, text2: result });
    }
  };

  return (
    <View style={styles.containerModal}>
          <View style={{width: '80%',}}>
            <Text style={{fontSize: 15}}>Adicionar usuário à lista</Text>
            <TextInput
              placeholder="E-mail"
              style={{  height: 40, borderColor: 'gray'}}
              onChangeText={text => setEmail(text)}
              value={email}
            />
          </View>
            <TouchableOpacity style={{ width: '80%' }}>
              <Button mode="contained" onPress={handleSendEmail} children={'Adicionar'}></Button>
            </TouchableOpacity>
        <Toast config={toastConfig} />
    </View>
  );
};

export default AddParticipant;
