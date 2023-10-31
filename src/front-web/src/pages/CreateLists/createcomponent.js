import React, { useState } from 'react';
import logo from "../../img/logo1.png";
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
    if (newList.listaTitulo.trim() === '') {
      alert('Sua lista precisa de um nome');
      return;
    }
  
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
      <p style={{marginLeft: '10em', fontSize:'2em'}}>Criar Nova Lista</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width:'100%', marginTop:'5em' }}>
        <div class="inputs">
          <label>
            <input style={{ height: '6vh', width: '18em', borderRadius: '1vh', marginBottom: '3vh' }}
              type="text"
              placeholder="Título da Lista"
              name="listaTitulo"
              value={newList.listaTitulo}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            <input style={{ height: '6vh', width: '18em', borderRadius: '1vh'}}
              type="text"
              name="listaDescricao"
              placeholder="Descrição"
              value={newList.listaDescricao}
              onChange={handleInputChange}
            />
          </label>
        </div>
      </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width:'100%' }}>
          <div class="button">
          <p style={{ marginTop: '10px', borderBottom: '1px ridge #D62828'}}></p>
            <button onClick={handleCreateList} style={{height: '6vh', width: '18em', borderRadius: '1vh', backgroundColor: '#003049', border:'none', color: 'white',
                            cursor: 'pointer', fontSize:'14px'}}>
              Criar Lista
            </button>

          </div>
        </div>
    </div>
  );
}

export default CreateList;