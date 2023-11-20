import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getListItemsAsync } from './../../services/lists/listService';

interface ListItem {
  id: number;
  listaId: number;
  descricao: string;
  nome: string;
  status: boolean;
  nomeLista: string;
}

const ListItemsScreen: React.FC = () => {
  const [items, setItems] = useState<ListItem[]>([]);

  useEffect(() => {
    const fetchListItems = async () => {
      try {
        const response = await getListItemsAsync(1); //TESTE
        console.log('Resposta da API:', response);

        if (response) {
          setItems(response);
        }
      } catch (error) {
        console.error('Erro ao buscar os itens da lista:', error);
      }
    };

    fetchListItems();
  }, []);

  const renderItem = ({ item }: { item: ListItem }) => (
    <View style={styles.listItem}>
      <Text>{item.nome}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Itens da Lista</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
});

export default ListItemsScreen;
