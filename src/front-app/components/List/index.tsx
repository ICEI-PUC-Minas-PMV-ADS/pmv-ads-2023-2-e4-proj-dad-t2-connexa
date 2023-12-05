import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ListDTO,
  ListParticipant,
} from "../../services/authentication/lists/dtos/ListDTO";
import Toast from "react-native-toast-message";
import {
  Text as TextPaper,
  Button as ButtonPaper,
  Title,
} from "react-native-paper";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import {
  getListsByOwnerOrParticipant,
  deleteListAsync,
  deleteParticipantAsync,
} from "../../services/authentication/lists/listService";
import { useConnexaRealTime } from "../../realtime/useSignalR";
/* import { useConnexaRealTime } from "../../realtime/useSignalR"; */

enum FilterScreen {
  MyItems = 1,
  Member = 2,
  All = 3,
}

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const ListaItens: React.FC = () => {
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [items, setItems] = useState<ListDTO[]>([
    {
      idUserTarget: 1,
      isOwner: true,
      listaDescricao: "",
      listaId: 1,
      listaPublica: true,
      listaStatus: true,
      listaTitulo: "",
      participants: [],
      userId: 1,
    },
  ]);

  const [filterOption, setFilterOption] = useState<number>(FilterScreen.All);
  const [participants, setParticipants] = useState<ListParticipant[]>([]);
  const [idOwner, setIdOwner] = useState<string | null>(null);

  const screenItems = useMemo(() => {
    switch (filterOption) {
      case FilterScreen.All:
        return items;
      case FilterScreen.MyItems:
        return items.filter((m) => m.isOwner);
      case FilterScreen.Member:
        return items.filter((m) => !m.isOwner);
      default:
        return items;
    }
  }, [filterOption, items]);

  const updateItensAfterRealTime = useCallback(
    (
      items: ListDTO[],
      item: ListDTO,
      set: React.Dispatch<React.SetStateAction<ListDTO[]>>
    ) => {
      if (items) {
        var existNewItem = items.find((f) => f.listaId === item.listaId);
        if (existNewItem) {
          items.forEach((f) => {
            if (f.listaId === item.listaId) {
              f.listaTitulo = item.listaTitulo;
              f.listaPublica = item.listaPublica;
              f.listaDescricao = item.listaDescricao;
              f.listaStatus = item.listaStatus;
            }
          });
          set(items);
        } else {
          set([...items, item]);
        }
      }
    },
    [items]
  );

  function populateItemsRealTime(item: ListDTO) {
    const index = items.findIndex((f) => f.listaId === item.listaId);
    const copy = [...items];
    if (index === -1) copy.push(item);
    else copy[index] = item;
    setItems(copy);
  }

  function deleteItemRealTime(id: number) {
    setItems(items.filter((f) => f.listaId !== id));
  }

  useConnexaRealTime({
    listCallback: populateItemsRealTime,
    deleteListCallback: deleteItemRealTime,
    listItemCallback(listItem) {},
    deleteListItemCallback(id) {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (idOwner) {
          const response = await getListsByOwnerOrParticipant(Number(idOwner));
          if (response) {
            setItems(response);
          }
        }
      } catch (error) {
        console.error("Erro ao obter os itens:", error);
      }
    };

    fetchData();
  }, [idOwner]);

  const customStyles = {
    content: {
      height: "auto",
      width: "25%",
      margin: "auto",
    },
  };

  const HandleModal = () => {
    setModalStatus(!modalStatus);
  };

  const showMyItens = () => {
    setFilterOption(FilterScreen.MyItems);
  };

  const showParticipantItens = () => {
    setFilterOption(FilterScreen.Member);
  };

  const showAllItens = () => {
    setFilterOption(FilterScreen.All);
  };

  const deleteListCallback = useCallback(
    async (idList: number) => {
      var removed = await deleteListAsync(Number(idList));
      if (removed) {
        Toast.show({ type: "success", text1: "Lista removida com sucesso." });

        setItems(items.filter((i) => i.listaId !== idList));
      } else {
        Toast.show({
          type: "error",
          text1: "Erro ao tentar remover a lista...",
        });
      }
    },
    [items]
  );

  const deleteParticipantCallback = useCallback(
    async (idParticipant: number) => {
      var removed = await deleteParticipantAsync(Number(idParticipant));
      if (removed) {
        Toast.show({
          type: "success",
          text1: "Participante removido com sucesso...",
        });

        setParticipants(
          participants.filter((i) => i.idParticipant !== idParticipant)
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Erro ao tentar remover o participante...",
        });
      }
    },
    [participants]
  );

  /* const theme = createTheme({
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
  }); */

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setIdOwner(storedUserId);
        }
      } catch (error) {
        console.error("Erro ao obter o userId do AsyncStorage:", error);
      }
    };

    fetchUserId();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      margin: 20,
      fontSize: 25,
    },
    itemContainer: {
      width: "97%",
      margin: 5,
      borderRadius: 10,
      padding: 10,
      borderBottomWidth: 1,
      borderColor: "#D62828",
      marginBottom: 15,
    },
    containerTituloStatus: {
      flexDirection: "row",
    },
    titulo: {
      fontSize: 22,
      marginRight: 10,
    },
    status: {
      fontSize: 16,
      position: "relative",
      top: 5,
    },
    descricao: {
      fontSize: 18,
      marginTop: 5,
    },
    botoes: {
      margin: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });

  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  return (
    <View style={styles.container}>
      {/* <Title style={{ margin: 16 }}>Minhas listas</Title> */}
      <View
        style={{ flexDirection: "row", justifyContent: "flex-end", margin: 16 }}
      >
        <ButtonPaper
          style={{ borderColor: "#003049", margin: 3, borderRadius: 10 }}
          mode="outlined"
          compact
          onPress={showAllItens}
          labelStyle={{ fontSize: 16 }}
        >
          Todas
        </ButtonPaper>
        <ButtonPaper
          style={{ borderColor: "#003049", margin: 3, borderRadius: 10 }}
          mode="outlined"
          compact
          onPress={showMyItens}
          labelStyle={{ fontSize: 16 }}
        >
          Minhas Listas
        </ButtonPaper>
        <ButtonPaper
          style={{ borderColor: "#003049", margin: 3, borderRadius: 10 }}
          mode="outlined"
          compact
          onPress={showParticipantItens}
          labelStyle={{ fontSize: 16 }}
        >
          Listas que participo
        </ButtonPaper>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignContent: "center",
        }}
      ></View>
      <ScrollView style={{ width: "100%" }}>
        {screenItems.map((item) => (
          <View key={item.listaId} style={styles.itemContainer}>
            <View style={styles.containerTituloStatus}>
              <Text style={styles.titulo} numberOfLines={2}>
                {item.listaTitulo}
              </Text>
              <Text style={styles.status}>
                {item.isOwner ? "-  DONO" : "-  PARTICIPANTE"}
              </Text>
            </View>
            <Text style={styles.descricao}>{item.listaDescricao}</Text>
            <View style={styles.botoes}>
              <TouchableOpacity style={{ marginRight: 10 }}>
                <>
                  {console.log("item antes de tudo", item)}
                  <Button
                    title="Ver Lista"
                    onPress={() =>
                      navigation.navigate("ListItemsScreen", {
                        listaId: item.listaId,
                        isOwner: item.isOwner,
                      })
                    }
                  />
                </>
              </TouchableOpacity>
              {/* {item.isOwner && (
                <TouchableOpacity
                  onPress={() => {
                    handlePress(`list/${item.listaId}/itemList/edit/${item.listaTitulo}/${item.listaDescricao}`);
                  }}
                  style={{ marginRight: 10 }}
                >
                  <Icon name="edit" size={24} color="#003049" />
                </TouchableOpacity>
              )} */}
              {item.isOwner && (
                <TouchableOpacity style={{ marginRight: 10 }}>
                  <Icon
                    name="person"
                    size={24}
                    color="#003049"
                    onPress={() =>
                      navigation.navigate("AddParticipant", {
                        listaId: item.listaId,
                      })
                    }
                  />
                </TouchableOpacity>
              )}
              {item.isOwner && (
                <TouchableOpacity
                  onPress={() => deleteListCallback(item.listaId)}
                >
                  <Icon name="delete" size={24} color="#003049" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
        <Modal isVisible={modalStatus}>{/* ... (modal content) */}</Modal>
      </ScrollView>
    </View>
  );
};

export default memo(ListaItens);
