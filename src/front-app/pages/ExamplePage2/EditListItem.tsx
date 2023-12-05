import React, { useState } from 'react';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import { Modal, TouchableOpacity, View } from 'react-native';
import { addUserLista } from '../../services/permission/PermissionService';
import Toast from 'react-native-toast-message';
import toastConfig from '../../core/toastConfig';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateListItemAsync } from '../../services/authentication/lists/listService';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ListItem {
  id: number;
  listaId: number;
  descricao: string;
  nome: string;
  status: boolean;
  nomeLista: string;
}

const EditListItem = (props: {itemLista: ListItem, idLista: number, idItem: number,  hasChange: () => void }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState(props.itemLista.nome);
  const [description, setDescription] = useState(props.itemLista.descricao);
 
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleCreateListItem = async () => {
    const userId = await AsyncStorage.getItem('userId');

    const response = await updateListItemAsync({
      id: props.idItem,
      listaId: props.idLista,
      nome: name,
      descricao: description,
    })
    props.hasChange()
    handleCloseModal()

    console.log({ response })
  };

  return (
    <View style={styles.containerModal}>
      <TouchableOpacity style={{alignItems: 'flex-end', marginTop: '-20px' }} onPress={handleOpenModal}>
        <Icon name="edit" size={24} color="#003049" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <View style={styles.outerView}>
          <View style={styles.modalView}>
            <TextInput
              placeholder="Nome"
              style={{ width: '100%', height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={text => setName(text)}
              value={name}
            />
            <TextInput
              placeholder="Descrição"
              style={{ width: '100%', height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={text => setDescription(text)}
              value={description}
            />

            <TouchableOpacity style={{ width: '100%' }}>
              <Button mode="contained" onPress={handleCreateListItem} children={'Atualizar'}></Button>
              <Button mode="contained" onPress={handleCloseModal} children={'Fechar'}></Button>
            </TouchableOpacity>
          </View>
        </View>

        <Toast config={toastConfig} />
      </Modal>
    </View>
  );
};

export default EditListItem;
