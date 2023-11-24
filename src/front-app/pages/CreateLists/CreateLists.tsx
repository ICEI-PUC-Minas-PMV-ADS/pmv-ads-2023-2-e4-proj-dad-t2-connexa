import React, { useState, useEffect } from 'react';
import ToastContainer from 'react-native-toast-message';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Background from '../../components/Background';
import { View, TouchableOpacity } from 'react-native';
import { saveCreateListAsync } from '../../services/lists/listService';
import { CreateListDTO } from '../../services/lists/dtos/CreateListDto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateList: React.FC = () => {
  const [newList, setNewList] = useState<CreateListDTO>({
    listaTitulo: '',
    listaDescricao: '',
    userId: 0,
    listaPublica: true,
    listaStatus: true,
    listaId: 40,
    message: '',
  });

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setNewList((prevList) => ({
            ...prevList,
            userId: parseInt(userId, 10),
          }));
        }
      } catch (error) {
        console.error('Erro ao obter userId do AsyncStorage:', error);
      }
    };

    getUserId();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setNewList({
      ...newList,
      [name]: value,
    });
  };

  const handleCreateList = async () => {
    if (newList.listaTitulo.trim() === '') {
      ToastContainer.show({ type: 'error', text1: 'DÊ UM NOME A SUA LISTA'});
      return;
    }

    try {
      const response = await saveCreateListAsync(newList);

      if (response) {
        ToastContainer.show({ type: 'success', text1: 'NOVA LISTA CRIADA COM SUCESSO'});
      } else {
        ToastContainer.show({ type: 'error', text2: 'Erro ao criar a lista na API',
        });
      }
    } catch (error) {
      console.error('Erro ao criar a lista na API:', error);
      ToastContainer.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Erro ao criar a lista na API',
      });
    }
  };

  return (
    <Background>
      <View style={{ alignItems: 'center' }}>
        <Header>Nova Lista</Header>
        <TextInput
          placeholder="Nome da Lista*"
          value={newList.listaTitulo}
          onChangeText={(text) => handleInputChange('listaTitulo', text)}
        />
        <TextInput
          placeholder="Descrição"
          value={newList.listaDescricao}
          onChangeText={(text) => handleInputChange('listaDescricao', text)}
        />
        <TouchableOpacity style={{ width: '100%' }}>
          <Button mode="contained" onPress={handleCreateList}>
            Salvar
          </Button>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

export default CreateList;