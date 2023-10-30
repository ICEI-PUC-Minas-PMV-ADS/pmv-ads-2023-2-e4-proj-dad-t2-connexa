import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ListaItens = ({ idList }) => {
  const [itens, setItens] = useState([]);

  useEffect(() => {
    const idOwner = localStorage.getItem('userId');

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7150/gateway/list/lists/${idList}/items`);
        setItens(response.data);
      } catch (error) {
        console.error('Erro ao obter os itens:', error);
      }
    };

    if (idOwner) {
      fetchData();
    }
  }, [idList]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {itens.map(item => (
          <div
            key={item.itemId}
            style={{
              display: 'flex',
              flexDirection: 'row',
              textAlign: 'center',
              alignContent: 'center',
              justifyContent: 'space-between',
              width : '80vw',
              margin: '5px 50px',
              borderRadius: '10px',
              backgroundColor: 'whitesmoke',
              justifyContent: 'space-between',
              padding: '10px'}}
          >
            <Typography component="h1" variant="h5">
              {item.nome}
            </Typography>
            <div style={{ display: 'flex' }}>
              <IconButton>
                <EditIcon />
              </IconButton>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaItens;
