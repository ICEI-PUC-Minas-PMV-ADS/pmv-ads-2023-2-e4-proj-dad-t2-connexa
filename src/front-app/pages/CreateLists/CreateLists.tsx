import React, { useState, useEffect } from 'react';
import ToastContainer from 'react-native-toast-message';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Background from '../../components/Background';
import { View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateListDTO } from '../../services/authentication/lists/dtos/CreateListDto';
import { saveCreateListAsync } from '../../services/authentication/lists/listService';

const CreateList: React.FC = () => {
  const [newList, setNewList] = useState<CreateListDTO>({
    listaTitulo: '',
    listaDescricao: '',
    userId: 0,
    listaPublica: true,
    listaStatus: true,
    listaId: 0, // Alterado para iniciar com 0, você pode ajustar conforme necessário
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obter o ID do usuário do AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setNewList((prevList) => ({
            ...prevList,
            userId: parseInt(userId, 10),
          }));
        }

        // Obter o ID da lista se necessário (ajuste conforme sua lógica)
        const listId = await AsyncStorage.getItem('listId');
        if (listId) {
          setNewList((prevList) => ({
            ...prevList,
            listaId: parseInt(listId, 10),
          }));
        }
      } catch (error) {
        console.error('Erro ao obter dados do AsyncStorage:', error);
      }
    };

    fetchData();
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
      // Chamar a função para criar uma nova lista na API
      const response = await saveCreateListAsync(newList);

      if (response) {
        ToastContainer.show({ type: 'success', text1: 'NOVA LISTA CRIADA COM SUCESSO'});
      } else {
        ToastContainer.show({ type: 'error', text2: 'Erro ao criar a lista na API' });
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
