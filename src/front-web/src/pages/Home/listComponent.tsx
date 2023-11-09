import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import React, { useState, useEffect, useCallback } from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {deleteListAsync, getListsByOwnerOrParticipant} from "../../services/lists/listService";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ListDTO } from '../../types/ListDTO';
import { IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';


const ListaItens = () => {
  const [itens, setItens] = useState<ListDTO[]>([]);
  const idOwner = localStorage.getItem('userId');
  useEffect(() => { 
    const fetchData = async () => {
      try {
        if (idOwner) {
          const response = await getListsByOwnerOrParticipant(Number(idOwner));

          if (response) {
            setItens(response);
          }
        }
      } catch (error) {
        console.error('Erro ao obter os itens:', error);
      }
    };

    fetchData();
  }, [idOwner]);

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
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignContent: 'center'}}>
            {itens.map(item =>
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
                        ({item.isOwner ? "DONO" : "PARTICIPANTE"})
                      </Typography>
                      <Link to={`list/${item.listaId}/itemList/edit/${item.listaTitulo}/${item.listaDescricao}`} style={{ margin: '0 0.6em',}} onClick={() => { localStorage.setItem('selectedList', JSON.stringify(item));}}>
                        <ModeEditIcon style={{color:'#003049'}}/>
                      </Link>
                      <Link to={`list/${item.listaId}/itemlist/${item.listaTitulo}/${item.listaDescricao}`} style={{ margin: '0 0.6em',}} onClick={() => { localStorage.setItem('selectedList', JSON.stringify(item));}}>
                        <Button style={{borderColor:'#003049', color:'#003049'}} variant="outlined" size="small">
                          Ver Lista
                        </Button>
                      </Link>
                      {
                        item.isOwner ? 
                        (<IconButton >
                          <DeleteIcon onClick={() => deleteListCallback(item.listaId)}/>
                        </IconButton>) : ""
                      }
                    </div>
                  </div>
                )
            })}
        </div>
      </ThemeProvider>
    </div>
  );
  
};

export default ListaItens;
