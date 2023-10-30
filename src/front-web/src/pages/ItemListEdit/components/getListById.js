import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListTitleById = ({ idList }) => {
  const [item, setItem] = useState([]);

  useEffect(() => {
    const idOwner = localStorage.getItem('userId');

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7150/gateway/list/lists/${idList}`);
        setItem(response.data);
      } catch (error) {
        console.error('Erro ao obter os itens:', error);
      }
    };

    if (idOwner) {
      fetchData();
    }
  }, [idList]);

  return ( 
    <div>
        <label key={item.id}>{item.listaTitulo || "Título não encontrado"}</label>
    </div>
  );
};

export default ListTitleById;
