import React, { useState, useEffect } from 'react';
import ListsService from '../../services/lists/ListsService'


const ListaItens = () => {
  const [itens, setItens] = useState([]);
  const listsService = new ListsService();

  useEffect(() => {
    const idOwner = localStorage.getItem('userId');

    const fetchData = async () => {
      try {
        if (idOwner) {
          const response = await listsService.getListByOwner(idOwner);

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
