import React, { useState, useEffect } from 'react';
import {getListByOwner} from "../../services/lists/listService";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Link } from 'react-router-dom';


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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaItens;
