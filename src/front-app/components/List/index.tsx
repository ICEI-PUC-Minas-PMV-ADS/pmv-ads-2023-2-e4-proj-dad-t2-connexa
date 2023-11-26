import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteListAsync, deleteParticipantAsync, getListsByOwnerOrParticipant } from '../../services/lists/listService';
import { ListDTO, ListParticipant } from '../../services/lists/dtos/ListDTO';
import Toast from 'react-native-toast-message';

const ListaItens: React.FC = () => {

  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [itens, setItens] = useState<ListDTO[]>([]);
  const [screenItens, setScreenItens] = useState<ListDTO[]>([]);
  const [participants, setParticipants] = useState<ListParticipant[]>([]);
  const navigation = useNavigation();
  const [idOwner, setIdOwner] = useState<string | null>(null);


  const updateItensAfterRealTime = useCallback((items : ListDTO[], item : ListDTO, set : React.Dispatch<React.SetStateAction<ListDTO[]>>) => {
    if(items){
      var existNewItem = items.find(f => f.listaId === item.listaId);
      if(existNewItem){
        items.forEach(f => {
          if(f.listaId === item.listaId){
            f.listaTitulo = item.listaTitulo;
            f.listaPublica = item.listaPublica;
            f.listaDescricao = item.listaDescricao;
            f.listaStatus = item.listaStatus;
          }  
        });
        set(items);
      }else{
        set([...itens, item])
      }
    }
  }, [itens]);

  const deleteListCallback = useCallback(async (idList : number) => {
    var removed = await deleteListAsync(Number(idList));
    if(removed){
      Toast.show({type: 'success', text1: 'Lista removida com sucesso.'})

      setItens(itens.filter(i => i.listaId !== idList));
    }else{
      Toast.show({type:"error", text1: "Erro ao tentar remover a lista..."});
    }
  }, [itens]);

  const deleteParticipantCallback = useCallback(async (idParticipant : number) => {
    var removed = await deleteParticipantAsync(Number(idParticipant));
    if(removed){
      Toast.show({type: 'success', text1:"Participante removido com sucesso..."})

      setParticipants(participants.filter(i => i.idParticipant !== idParticipant));
    }else{
      Toast.show({type: "error", text1:"Erro ao tentar remover o participante..."});
    }
  }, [participants]);
  
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setIdOwner(storedUserId);
        }
      } catch (error) {
        console.error('Erro ao obter o userId do AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (idOwner) {

          const response = await getListsByOwnerOrParticipant(Number(idOwner));
          if (response) {
            setItens(response);
            setScreenItens(response);
          }
        }
      } catch (error) {
        console.error('Erro ao obter os itens:', error);
      }
    };

    fetchData();
  }, [idOwner]);

  const listRealTimeCallBack = useCallback((list: ListDTO) => {
    console.log(list);
    let currentItems = itens.slice();
    updateItensAfterRealTime(currentItems, list, setItens);

    let currentScreenItens = screenItens.slice();
    updateItensAfterRealTime(currentScreenItens, list, setScreenItens);
  }, [itens, screenItens, updateItensAfterRealTime]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 20,
    },
    itemContainer: {
      width: '97%',
      margin: 5,
      borderRadius: 10,
      padding: 10,
      borderBottomWidth: 1,
      borderColor: '#D62828',
      marginBottom: 15,
    },
    containerTituloStatus: {
      flexDirection: 'row'
    },
    titulo:{
      fontSize: 20, 
      marginRight: 10
    },
    status:{
      fontSize: 16,
      position: 'relative',
      top: 5
    },
    descricao:{
      fontSize: 16, 
      marginTop: 5
    },
    botoes: {
      margin: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }
    

  });

  return (
    <View style={styles.container}>
      <ScrollView style={{width: '100%'}}>
      {screenItens.map(item => (
        <View key={item.listaId} style={styles.itemContainer}>
          <View style={styles.containerTituloStatus}>
            <Text style={styles.titulo}>{item.listaTitulo}</Text>
            <Text style={styles.status}>{item.isOwner ? '-  DONO' : '-  PARTICIPANTE'}</Text>
          </View>
          <Text style={styles.descricao}>{item.listaDescricao}</Text>
          <View style={styles.botoes}>
            <TouchableOpacity
             /*  onPress={() => navigation.navigate(`list/${item.listaId}/itemlist/${item.listaTitulo}/${item.listaDescricao}`)}
              style={{ marginRight: 10 }} */
            >
              <Button title="Ver Lista" onPress={() => {}} />
            </TouchableOpacity>
            {item.isOwner && (
              <TouchableOpacity
                /* onPress={() => {
                  navigation.navigate(`list/${item.listaId}/itemList/edit/${item.listaTitulo}/${item.listaDescricao}`);
                }} */
                style={{ marginRight: 10 }}
              >
                <Icon name="edit" size={24} color="#003049" />
              </TouchableOpacity>
            )}
            {item.isOwner && (
              <TouchableOpacity onPress={() => setModalStatus(true)} style={{ marginRight: 10 }}>
                <Icon name="person" size={24} color="#003049" />
              </TouchableOpacity>
            )}
            {item.isOwner && (
              <TouchableOpacity onPress={() => deleteListCallback(item.listaId)}>
                <Icon name="delete" size={24} color="#003049" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
      <Modal isVisible={modalStatus}>
        {/* ... (modal content) */}
      </Modal>
      </ScrollView>
    </View>
  );
};

export default ListaItens;
