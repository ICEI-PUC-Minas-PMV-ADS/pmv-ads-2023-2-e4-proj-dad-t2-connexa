import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListaItens = () => {
  const [itens, setItens] = useState([]);

  useEffect(() => {
    const idOwner = localStorage.getItem('userId');

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7150/gateway/list/lists/owner/${idOwner}`);
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
          <li key={item.listaId}>
            <h2>{item.listaTitulo}</h2>
            <p>ID da Lista: {item.listaId}</p>
            <p>Descrição: {item.listaDescricao}</p>
            <p>Status: {item.listaStatus ? 'Ativa' : 'Inativa'}</p>
            <p>Pública: {item.listaPublica ? 'Sim' : 'Não'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaItens;
