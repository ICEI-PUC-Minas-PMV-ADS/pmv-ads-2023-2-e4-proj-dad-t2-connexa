import React, { memo, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { getListItemsAsync } from '../../services/authentication/lists/listService';
import AddListItem from '../ExamplePage2/AddListItem';
import { ScrollView } from 'react-native-gesture-handler';

interface ListItem {
  id: number;
  listaId: number;
  descricao: string;
  nome: string;
  status: boolean;
  nomeLista: string;
}

const ListItemsScreen: React.FC = () => {

  
  const route = useRoute();
  const [items, setItems] = useState<ListItem[]>([]);
  const [idOwner, setIdOwner] = useState<string | null>(null);
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

  const fetchListItems = async () => {
    try {
      const response = await getListItemsAsync( (route.params as any).listaId);
      console.log('Resposta da API:', response);
      
      if ( response === null || response.length === 0 ) {
        Toast.show({ type: 'error', text1: 'Nenhum item encontrado.' })
      } else {
        setItems(response);
      }
    } catch (error) {
      console.error('Erro ao buscar os itens da lista:', error);
    }
  };
  const hasChange = () => { 
    
    fetchUserId();
    fetchListItems();
   }
  
  useEffect(() => {
    fetchUserId();
    fetchListItems();
   
  }, [(route.params as any).listaId]);

  const renderItem = ({ item }: { item: ListItem }) => (
    <View style={styles.listItem}>
      <Text>{item.nome}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Itens da Lista</Text>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
        {
          (route.params as any).isOwner &&
      <View style={styles.containerButton}>
        <AddListItem idLista={(route.params as any).listaId} hasChange={hasChange}/>
      </View>
        }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 50
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  containerButton:{
    display: 'flex', 
    position: 'absolute', 
    bottom: 0,
    width: 450
  }
});

export default memo(ListItemsScreen) ;
