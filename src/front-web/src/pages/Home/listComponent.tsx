import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {getListByOwner} from "../../services/lists/listService";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ListDTO } from '../../types/ListDTO';

const ListaItens = () => {
  const [itens, setItens] = useState<ListDTO[]>([]);

  useEffect(() => {
    const idOwner = localStorage.getItem('userId');

    const fetchData = async () => {
      try {
        if (idOwner) {
          const response = await getListByOwner(Number(idOwner));

          if (response) {
            setItens(response);
          }
        }
      } catch (error) {
        console.error('Erro ao obter os itens:', error);
      }
    };

    fetchData();
  }, []);

  const theme = createTheme({
    typography: {
      fontFamily: 'Roboto, sans-serif', // Substitua "Nome da Fonte" pelo nome da fonte escolhida
    },
  });

  return (
    <div>
      <ThemeProvider theme={theme}>
        <div>
          <p style={{marginLeft: '10em', fontSize:'2em'}}>Minhas Listas</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {itens.map(item => (
              <div key={item.listaId} style={{display: 'flex', borderBottom: '1px ridge #D62828', justifyContent: 'space-between'}}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                  <p style={{marginRight: '1em', fontSize: '2em'}}>{item.listaTitulo}</p>
                  <p>-</p>
                  <p style={{marginLeft: '1em', fontSize: '1.2em'}}>{item.listaDescricao}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '2em'}}>
                  <Link to={`list/${item.listaId}/itemList/edit`} style={{ margin: '0 1em',}}>
                    <ModeEditIcon style={{color:'#003049'}}/>
                  </Link>
                  <Link to={`list/${item.listaId}/itemlist`} style={{ margin: '0 1em',}}>
                    <Button style={{borderColor:'#003049', color:'#003049'}} variant="outlined" size="small">
                      Ver Lista
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </ThemeProvider>
    </div>
  );
  
};

export default ListaItens;
