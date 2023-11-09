import React, { useState, ChangeEvent } from 'react';
import Modal from 'react-modal';
import { postCreateList } from '../../services/lists/listService';
import { CreateListDTO } from './../../services/lists/dtos/CreateListDto';

Modal.setAppElement('#root');

interface NewList {
  listaId: number;
  listaTitulo: string;
  listaDescricao: string;
  userId: string | null;
  listaPublica: boolean;
  listaStatus: boolean;
}

function EditList() {
  const idOwner = localStorage.getItem('userId');
  const list: CreateListDTO = JSON.parse(localStorage.getItem('selectedList')!) ?? null;

  const [newList, setNewList] = useState<NewList>({
    listaId: list.listaId,
    listaTitulo: list.listaTitulo,
    listaDescricao: list.listaDescricao,
    userId: idOwner,
    listaPublica: true,
    listaStatus: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  
      const createListDTO: CreateListDTO = {
        listaId: newList.listaId, // Preencha com o valor apropriado
        userId: parseInt(newList.userId || '0'), // Converte userId para número
        listaPublica: newList.listaPublica,
        listaStatus: newList.listaStatus,
        listaDescricao: newList.listaDescricao,
        listaTitulo: newList.listaTitulo,
        message: '', // Preencha com o valor apropriado
      };
  
      const response = await postCreateList(createListDTO);
  
      if (response) {
        alert(response);
        setIsModalOpen(false); // Fecha o modal após criar a lista
      } else {
        alert('Erro ao criar a lista na API');
      }
    } catch (error) {
      console.error('Erro ao criar a lista na API:', error);
    }
  };
  const openCreateListPopup = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: '#003049',
          textDecoration: 'none',
          color: 'inherit',
          marginRight: '20px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
        }}
        onClick={openCreateListPopup}
      >
        Editar Lista
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Editar Lista"
        style={{
          content: {
            height: '70%',
            width: '26%',
            margin: 'auto',
          },
        }}
      >
        <div>
          <p style={{ fontSize: '2em', marginLeft: '2em' }}>Editar Lista</p>
          <div className="inputs">
            <label>
              <input
                style={{
                  height: '6vh',
                  width: '18em',
                  marginLeft: '4em',
                  borderRadius: '1vh',
                  marginBottom: '3vh',
                }}
                type="text"
                placeholder="Título da Lista"
                name="listaTitulo"
                value={newList.listaTitulo}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              <input
                style={{
                  height: '6vh',
                  width: '18em',
                  marginLeft: '4em',
                  borderRadius: '1vh',
                  marginBottom: '3vh',
                }}
                type="text"
                name="listaDescricao"
                placeholder="Descrição"
                value={newList.listaDescricao}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <button
            onClick={handleCreateList}
            style={{
              marginTop: '1em',
              height: '6vh',
              width: '18em',
              marginLeft: '3.7em',
              borderRadius: '1vh',
              backgroundColor: '#003049',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Criar Lista
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default EditList;
