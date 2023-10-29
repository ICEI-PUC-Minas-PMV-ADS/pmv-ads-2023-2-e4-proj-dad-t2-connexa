import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListaItens = ({idList}) => {
  const [itens, setItens] = useState([]);

  useEffect(() => {
    const idOwner = localStorage.getItem('userId');

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7150/gateway/list/lists/${idList}/itemList/`);
        setItens(response.data);
      } catch (error) {
        console.error('Erro ao obter os itens:', error);
      }
    };

    if (idOwner) {
      fetchData();
    }
  }, []);

  return (
    <div>
      <ul>
        {itens.map(item => (
          <li key={item.itemId}>
            <h2>{item.itemNome}</h2>
            <p>ID da Lista: {item.listaId}</p>
            <p>Descrição: {item.itemDescricao}</p>
            <p>Status: {item.itemStatus ? 'Ativa' : 'Inativa'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaItens;
