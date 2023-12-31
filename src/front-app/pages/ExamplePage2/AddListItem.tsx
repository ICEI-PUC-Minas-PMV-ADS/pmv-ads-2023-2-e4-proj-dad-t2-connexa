import React, { useState } from 'react';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import { Modal, TouchableOpacity, View } from 'react-native';
import { addUserLista } from '../../services/permission/PermissionService';
import Toast from 'react-native-toast-message';
import toastConfig from '../../core/toastConfig';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveCreateListItemAsync } from '../../services/authentication/lists/listService';

const AddListItem = (props: { idLista: number, hasChange: () => void }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
 
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleCreateListItem = async () => {
    const userId = await AsyncStorage.getItem('userId');

    const response = await saveCreateListItemAsync({
      descricao: description,
      listaId: props.idLista,
      listaPublica: true,
      nomeLista: "foii",
      titulo: name,
      userId
    })
    props.hasChange()
    handleCloseModal()

    console.log({ response })
  };

  return (
    <View style={styles.containerModal}>
      <TouchableOpacity style={{ width: '100%', alignItems: 'center' }}>
        <Button style={{width: '90%', borderRadius: 5}} mode="contained" onPress={handleOpenModal} children={'Adicionar item à lista'}></Button>
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
              <Button mode="contained" onPress={handleCreateListItem} children={'Adicionar'}></Button>
              <Button mode="contained" onPress={handleCloseModal} children={'Fechar'}></Button>
            </TouchableOpacity>
          </View>
        </View>

        <Toast config={toastConfig} />
      </Modal>
    </View>
  );
};

export default AddListItem;
