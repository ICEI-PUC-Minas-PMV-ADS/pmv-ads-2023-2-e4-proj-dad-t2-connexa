import React, { useState } from 'react';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import { Modal, TouchableOpacity, View } from 'react-native';
import { addUserLista } from '../../services/permission/PermissionService';
import Toast from 'react-native-toast-message';
import toastConfig from '../../core/toastConfig';
import styles from './styles';

const AddParticipant = (props: { idLista: string | undefined }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  let idListaInt = 0
  if (typeof (props.idLista) === "string") {
    idListaInt = parseInt(props.idLista)
  }
  else {
    throw new Error("Não foi possível resgatar o id da lista.");
  }

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const [newUserLista, setNewUserLista] = useState({
    userEmail: email,
    listaId: idListaInt,
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
      <TouchableOpacity style={{ width: '100%' }}>
        <Button mode="contained" onPress={handleOpenModal} children={'Adicionar participante'}></Button>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <View style={styles.outerView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="E-mail"
              style={{ width: '100%', height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={text => setEmail(text)}
              value={email}
            />

            <TouchableOpacity style={{ width: '100%' }}>
              <Button mode="contained" onPress={handleSendEmail} children={'Adicionar'}></Button>
              <Button mode="contained" onPress={handleCloseModal} children={'Fechar'}></Button>
            </TouchableOpacity>
          </View>
        </View>

        <Toast config={toastConfig} />
      </Modal>
    </View>
  );
};

export default AddParticipant;
