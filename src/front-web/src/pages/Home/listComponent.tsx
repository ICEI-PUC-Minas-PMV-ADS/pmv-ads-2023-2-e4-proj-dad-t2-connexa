import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {deleteListAsync, deleteParticipantAsync, getListsByOwnerOrParticipant} from "../../services/lists/listService";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonICon from '@mui/icons-material/Person';
import { toast } from 'react-toastify';
import Modal from "react-modal";
import { ListDTO, ListParticipant } from '../../types/ListDTO';
import { useConnexaRealTime } from '../../realtime/useSignalR';

const ListaItens = () => {

  const [modalStatus, setModalStatus] = useState(false)
  const [itens, setItens] = useState<ListDTO[]>([]);
  const [screenItens, setScreenItens] = useState<ListDTO[]>([]);
  const [participants, setParticipants] = useState<ListParticipant[]>([]);
  const idOwner = localStorage.getItem('userId');

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

  const listRealTimeCallBack = useCallback((list : ListDTO) => {
    console.log(list);
    let currentItems = itens.slice();  
    updateItensAfterRealTime(currentItems, list, setItens);

    let currentScreenItens = screenItens.slice();
    updateItensAfterRealTime(currentScreenItens, list, setScreenItens);
  }, [itens, screenItens, updateItensAfterRealTime]);

  const connexaRealTimeHook = useConnexaRealTime({listCallback: listRealTimeCallBack, listItemCallback(listItem) {},});

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

  const customStyles = {
    content: {
      height: 'auto',
      width: '25%',
      margin: 'auto',
    }
  }

  const HandleModal = useCallback(() => {
    setModalStatus(!modalStatus)
  }, [modalStatus]);

  const showMyItens = useCallback(() => {
    setScreenItens(itens.filter(m => m.isOwner));
  }, [itens]);

  const showParticipantItens = useCallback(() => {
    setScreenItens(itens.filter(m => !m.isOwner));
  }, [itens]);

  const showAllItens = useCallback(() => {
    setScreenItens(itens);
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

  const theme = createTheme({
    typography: {
      fontFamily: 'Roboto, sans-serif', // Substitua "Nome da Fonte" pelo nome da fonte escolhida
    },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', textAlign: 'center' }}>
      <ThemeProvider theme={theme} >
        <Typography component="p" variant="h4" style={{margin: '1em'}}>
          Minhas listas
        </Typography>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end', marginRight: '1.5em'}}>
          <Button style={{borderColor:'#003049', color:'#003049', marginRight: '3px'}} variant="outlined" size="small" onClick={showAllItens}>
            Todas
          </Button>
          <Button style={{borderColor:'#003049', color:'#003049', marginRight: '3px'}} variant="outlined" size="small" onClick={showMyItens}>
            Minhas Listas
          </Button>
          <Button style={{borderColor:'#003049', color:'#003049'}} variant="outlined" size="small" onClick={showParticipantItens}>
            Listas que participo
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', width: '80%', margin: 'auto', marginTop: '1em', alignContent: 'center', justifyContent:'center'}}>
            {screenItens.map(item =>
            {
                return (
                  <div key={item.listaId} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '5px 50px', borderRadius: '10px', padding: '10px', borderBottom: '1px ridge #D62828', marginBottom: '1.5em'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start'}}>
                      <Typography component="p" variant="h4">
                        {item.listaTitulo}
                      </Typography>
                      <Typography component="p" variant='h6'>
                        {item.listaDescricao}
                      </Typography>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '2em'}}>
                      <Typography component="h1" variant="h6">
                        ({item.isOwner ? "Dono" : "Participante"})
                      </Typography>
                      <Link to={`list/${item.listaId}/itemlist/${item.listaTitulo}/${item.listaDescricao}`} style={{ margin: '0 0.6em',}}>
                        <Button style={{borderColor:'#003049', color:'#003049'}} variant="outlined" size="small">
                          Ver Lista
                        </Button>
                      </Link>
                      {
                        item.isOwner ? (
                          <Link to={`list/${item.listaId}/itemList/edit/${item.listaTitulo}/${item.listaDescricao}`} style={{ margin: '0 0.6em',}} onClick={() => { localStorage.setItem('selectedList', JSON.stringify(item));}}>
                            <ModeEditIcon style={{color:'#003049'}}/>
                          </Link>
                        ) : <div></div>
                      }
                      
                      {
                        item.isOwner ? 
                        (
                          <div style={{display: 'flex', flexDirection: 'row'}}>
                            <IconButton >
                              <PersonICon style={{color:'#003049'}} onClick={() => {
                                setParticipants(item.participants);
                                setModalStatus(true);
                              }}/>
                            </IconButton>
                            <IconButton >
                              <DeleteIcon style={{color:'#003049'}} onClick={() => deleteListCallback(item.listaId)}/>
                            </IconButton>
                          </div>
                        
                        ) : ""
                      }
                    </div>
                  </div>
                )
            })}
        </div>
      </ThemeProvider>
      <Modal
        isOpen={modalStatus}
        onRequestClose={HandleModal}
        style={customStyles}
      >
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center' }}>
          <h2>Participantes</h2>
          {
            participants.map((p) => (
              <div key={p.idParticipant} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Typography component="h1" variant="h6">
                  ({p.email})
                </Typography>
                <IconButton >
                  <DeleteIcon onClick={() => deleteParticipantCallback(p.idParticipant)}/>
                </IconButton>
              </div>
            ))
          }
          <Button
            style={{ backgroundColor: '#003049' }}
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
