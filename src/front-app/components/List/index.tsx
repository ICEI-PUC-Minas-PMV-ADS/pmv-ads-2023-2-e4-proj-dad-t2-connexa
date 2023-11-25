import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteListAsync, deleteParticipantAsync, getListsByOwnerOrParticipant } from '../../services/lists/listService';
import { ListDTO, ListParticipant } from '../../services/lists/dtos/ListDTO';
import { toast } from 'react-toastify';

const ListaItens: React.FC = () => {
  const [modalStatus, setModalStatus] = useState(false);
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
      toast.update(toast.loading("Aguarde..."), {
          render: "Lista removida com sucesso...",
          type: toast.TYPE.SUCCESS,
          autoClose: 3000,
          closeButton: true,
          isLoading: false
      });

      setItens(itens.filter(i => i.listaId !== idList));
    }else{
      toast.error("Erro ao tentar remover a lista...");
    }
  }, [itens]);

  const deleteParticipantCallback = useCallback(async (idParticipant : number) => {
    var removed = await deleteParticipantAsync(Number(idParticipant));
    if(removed){
      toast.success("Participante removido com sucesso...", {
          autoClose: 3000,
          closeButton: true,
          isLoading: false
      });

      setParticipants(participants.filter(i => i.idParticipant !== idParticipant));
    }else{
      toast.error("Erro ao tentar remover o participante...");
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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 20,
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
      borderRadius: 10,
      padding: 10,
      borderBottomWidth: 1,
      borderColor: '#D62828',
      marginBottom: 15,
    },
  });

  return (
    <View style={styles.container}>
      {screenItens.map(item => (
        <View key={item.listaId} style={styles.itemContainer}>
          <View style={{ flexDirection: 'column', justifyContent: 'start', alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 20 }}>{item.listaTitulo}</Text>
            <Text style={{ fontSize: 16 }}>{item.listaDescricao}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
            <Text style={{ fontSize: 16 }}>{item.isOwner ? 'DONO' : 'PARTICIPANTE'}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(`list/${item.listaId}/itemlist/${item.listaTitulo}/${item.listaDescricao}`)}
              style={{ margin: 5 }}
            >
              <Button title="Ver Lista" onPress={() => {}} />
            </TouchableOpacity>
            {item.isOwner ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(`list/${item.listaId}/itemList/edit/${item.listaTitulo}/${item.listaDescricao}`);
                  // localStorage.setItem('selectedList', JSON.stringify(item)); // Remove this line as localStorage is not available in React Native
                }}
                style={{ margin: 5 }}
              >
                <Icon name="edit" size={24} color="#003049" />
              </TouchableOpacity>
            ) : null}
            {item.isOwner ? (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setModalStatus(true)}>
                  <Icon name="person" size={24} color="#003049" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteListCallback(item.listaId)}>
                  <Icon name="delete" size={24} color="#003049" />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      ))}
      <Modal isVisible={modalStatus}>
        {/* ... (modal content) */}
      </Modal>
    </View>
  );
};

export default ListaItens;
