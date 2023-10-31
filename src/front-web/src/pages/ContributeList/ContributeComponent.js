import React, { useState, useEffect } from 'react';
import { getListParticipant } from "../../services/lists/listService";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ContributeList = () => {
  const [itens, setItens] = useState([]);

  useEffect(() => {
    const idparticipant = localStorage.getItem('userId');

    const fetchData = async () => {
      try {
        if (idparticipant) {
          const response = await getListParticipant(Number(idparticipant));

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
        <div>
          <p style={{marginLeft: '10em', fontSize:'2em'}}>Listas Que Contribuo</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', width: '100%' }}>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {itens.map(item => (
              <li key={item.listaId} style={{ display: 'flex', flexDirection: 'row', marginBottom: '1em', borderBottom: '1px ridge #D62828', paddingBottom: '1em'}}>
                <div style={{ marginRight: 'auto', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <p style={{marginRight: '1em', fontSize: '2em'}}>{item.listaTitulo}</p>
                  <p>-</p>
                  <p style={{marginLeft: '1em', marginRight: '2em', fontSize: '1.2em', textAlign: 'center'}}>{item.listaDescricao}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
  
};

export default ContributeList;
