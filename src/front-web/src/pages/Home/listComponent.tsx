import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
  deleteListAsync,
  deleteParticipantAsync,
  getListsByOwnerOrParticipant,
} from "../../services/lists/listService";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonICon from "@mui/icons-material/Person";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { ListDTO, ListParticipant } from "../../types/ListDTO";
import { useConnexaRealTime } from "../../realtime/useSignalR";

enum FilterScreen {
  MyItems = 1,
  Member = 2,
  All = 3,
}

const ListaItens = () => {
  const [modalStatus, setModalStatus] = useState(false);
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
  const idOwner = localStorage.getItem("userId");

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

  function populateItemsRealTime(item: ListDTO) {
    const index = items.findIndex((f) => f.listaId === item.listaId);
    const copy = [...items];
    if (index === -1) copy.push(item);
    else copy[index] = item;
    setItems(copy);
  }

  function deleteItemRealTime(id: number) {
    console.log(items);
    console.log(id);
    setItems(items.filter((f) => f.listaId !== id));
  }

  useConnexaRealTime({
    listCallback: populateItemsRealTime,
    deleteListCallback: deleteItemRealTime,
    listItemCallback(listItem) {},
    deleteListItemCallback(id) {},
  });

  const getLists = async (idOwner: number) => {
    const response = await getListsByOwnerOrParticipant(idOwner);
    if (response) {
      setItems(response);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (idOwner) {
          getLists(Number(idOwner));
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
        toast.update(toast.loading("Aguarde..."), {
          render: "Lista removida com sucesso...",
          type: toast.TYPE.SUCCESS,
          autoClose: 3000,
          closeButton: true,
          isLoading: false,
        });

        setItems(items.filter((i) => i.listaId !== idList));
      } else {
        toast.error("Erro ao tentar remover a lista...");
      }
    },
    [items]
  );

  const deleteParticipantCallback = useCallback(
    async (idParticipant: number) => {
      console.log("opa");
      var removed = await deleteParticipantAsync(Number(idParticipant));
      if (removed) {
        toast.success("Participante removido com sucesso...", {
          autoClose: 3000,
          closeButton: true,
          isLoading: false,
        });

        setParticipants(
          participants.filter((i) => i.idParticipant !== idParticipant)
        );
      } else {
        toast.error("Erro ao tentar remover o participante...");
      }
    },
    [participants]
  );

  const theme = createTheme({
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
        margin: "0 auto",
        textAlign: "center",
        width: "80%",
      }}
    >
      <ThemeProvider theme={theme}>
        <Typography component="p" variant="h4" style={{ margin: "1em" }}>
          Minhas listas
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            marginRight: "1.5em",
          }}
        >
          <Button
            style={{
              borderColor: "#003049",
              color: "#003049",
              marginRight: "3px",
            }}
            variant="outlined"
            size="small"
            onClick={showAllItens}
          >
            Todas
          </Button>
          <Button
            style={{
              borderColor: "#003049",
              color: "#003049",
              marginRight: "3px",
            }}
            variant="outlined"
            size="small"
            onClick={showMyItens}
          >
            Minhas Listas
          </Button>
          <Button
            style={{ borderColor: "#003049", color: "#003049" }}
            variant="outlined"
            size="small"
            onClick={showParticipantItens}
          >
            Listas que participo
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignContent: "center",
          }}
        >
          {screenItems.map((item) => {
            return (
              <div
                key={item.listaId}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: "5px 50px",
                  borderRadius: "10px",
                  padding: "10px",
                  borderBottom: "1px ridge #D62828",
                  marginBottom: "1.5em",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                  }}
                >
                  <Typography component="p" variant="h4">
                    {item.listaTitulo}
                  </Typography>
                  <Typography component="p" variant="h6">
                    {item.listaDescricao}
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "2em",
                  }}
                >
                  <Typography component="h1" variant="h6">
                    ({item.isOwner ? "DONO" : "PARTICIPANTE"})
                  </Typography>
                  <Link
                    to={`list/${item.listaId}/itemlist/${item.listaTitulo}/${item.listaDescricao}`}
                    style={{ margin: "0 0.6em" }}
                  >
                    <Button
                      style={{ borderColor: "#003049", color: "#003049" }}
                      variant="outlined"
                      size="small"
                    >
                      Ver Lista
                    </Button>
                  </Link>
                  {item.isOwner ? (
                    <Link
                      to={`list/${item.listaId}/itemList/edit/${item.listaTitulo}/${item.listaDescricao}`}
                      style={{ margin: "0 0.6em" }}
                      onClick={() => {
                        localStorage.setItem(
                          "selectedList",
                          JSON.stringify(item)
                        );
                      }}
                    >
                      <ModeEditIcon style={{ color: "#003049" }} />
                    </Link>
                  ) : (
                    <div></div>
                  )}

                  {item.isOwner ? (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <IconButton
                        onClick={() => {
                          setParticipants(item.participants);
                          setModalStatus(true);
                        }}
                      >
                        <PersonICon />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteListCallback(item.listaId)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ThemeProvider>
      <Modal
        isOpen={modalStatus}
        onRequestClose={HandleModal}
        style={customStyles}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <h2>Participantes</h2>
          {participants.map((p) => (
            <div
              key={p.idParticipant}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography component="h1" variant="h6">
                ({p.email})
              </Typography>
              <IconButton>
                <DeleteIcon
                  onClick={() => deleteParticipantCallback(p.idParticipant)}
                />
              </IconButton>
            </div>
          ))}
          <Button
            style={{ backgroundColor: "#003049" }}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 1 }}
            onClick={HandleModal}
          >
            Fechar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ListaItens;
