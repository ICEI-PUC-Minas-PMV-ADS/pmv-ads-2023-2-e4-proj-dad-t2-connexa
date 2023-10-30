import React, { useState } from 'react';
import { postCreateList } from '../../services/lists/listService';

function CreateList() {
  const idOwner = localStorage.getItem('userId');

  const [newList, setNewList] = useState({
    listaTitulo: '', // Inicialize com valores padrão ou vazios
    listaDescricao: '',
    userId: idOwner,
    listaPublica: true,
    listaStatus: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewList({
      ...newList,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCreateList = async () => {
    try {
      console.info('Chamou a função para criar uma nova lista na API');

      const response = await postCreateList(newList);

      if (response) {
        alert('Nova lista criada com sucesso:', response);
      } else {
        alert('Erro ao criar a lista na API');
      }
    } catch (error) {
      console.error('Erro ao criar a lista na API:', error);
    }
  };

  return (
    <div>
      <h2>Criar Nova Lista</h2>
      <label>
        Título da Lista:
        <input
          type="text"
          name="listaTitulo"
          value={newList.listaTitulo}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Descrição:
        <input
          type="text"
          name="listaDescricao"
          value={newList.listaDescricao}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <button onClick={handleCreateList}>Criar Lista</button>
    </div>
  );
}

export default CreateList;