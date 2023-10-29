import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {getListByOwner} from "../../services/lists/listService";


const ListaItens = () => {
  const [itens, setItens] = useState([]);

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
            <div>
              <Link to={`list/${item.listaId}/itemListedit`}>
                <ModeEditIcon/>
              </Link>
              <Link to={`list/${item.listaId}/itemlist`}>
                <Button variant="outlined" size="small">
                  Ver Lista
                </Button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaItens;
