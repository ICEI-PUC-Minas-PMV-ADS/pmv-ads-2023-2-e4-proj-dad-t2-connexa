import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { saveCreateListAsync } from '../../services/lists/listService';
import { CreateListDTO } from '../../services/lists/dtos/CreateListDto';

const CreateList: React.FC = () => {
  const idOwner = 29; //TESTE

  const [newList, setNewList] = useState<CreateListDTO>({
    listaTitulo: '',
    listaDescricao: '',
    userId: idOwner,
    listaPublica: true,
    listaStatus: true,
    listaId: 0, //TESTE
    message: '',
  });

  const handleInputChange = (name: string, value: string) => {
    setNewList({
      ...newList,
      [name]: value,
    });
  };

  const handleCreateList = async () => {
    if (newList.listaTitulo.trim() === '') {
      console.log('Erro', 'Sua lista precisa de um nome');
      return;
    }

    try {
      const response = await saveCreateListAsync(newList);

      if (response) {
        console.log('Sucesso', 'Nova lista criada com sucesso');
      } else {
        console.log('Erro', 'Erro ao criar a lista na API');
      }
    } catch (error) {
      console.error('Erro ao criar a lista na API:', error);
      Alert.alert('Erro', 'Erro ao criar a lista na API');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Lista</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da Lista*"
        value={newList.listaTitulo}
        onChangeText={(text) => handleInputChange('listaTitulo', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição*"
        value={newList.listaDescricao}
        onChangeText={(text) => handleInputChange('listaDescricao', text)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateList}
      >
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  title: {
    fontSize: 30,
    color: '#003049',
    marginBottom: 10,
  },
  input: {
    borderColor: '#003049',
    borderWidth: 1,
    width: '20%',
    height: 50,
    borderRadius: 4,
    marginTop: 20,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#003049',
    borderRadius: 4,
    width: '20%',
    height: 40,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CreateList;
