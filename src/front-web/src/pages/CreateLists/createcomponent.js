import React, { useState } from 'react';
import Modal from 'react-modal';
import { postCreateList } from '../../services/lists/listService';

Modal.setAppElement('#root');

function CreateList() {
  const idOwner = localStorage.getItem('userId');

  const [newList, setNewList] = useState({
    listaTitulo: '',
    listaDescricao: '',
    userId: idOwner,
    listaPublica: true,
    listaStatus: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <button style={{ backgroundColor: '#003049', textDecoration: 'none', color: 'inherit', marginRight: '20px', border: 'none', cursor: 'pointer', fontSize:'16px'}} onClick={openCreateListPopup}>Criar Lista</button>

      <Modal 
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Criar Nova Lista"
        style={{
          content: {
            height:'70%',
            width: '26%',
            margin: 'auto',
          },
        }}
      >
        <div>
          <p style={{ fontSize:'2em', marginLeft: '2em' }}>Criar Nova Lista</p>
          <div className="inputs">
            <label>
              <input
                style={{ height: '6vh', width: '18em', marginLeft: '4em',  borderRadius: '1vh', marginBottom: '3vh' }}
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
                style={{ height: '6vh', width: '18em', marginLeft: '4em', borderRadius: '1vh', marginBottom: '3vh' }}
                type="text"
                name="listaDescricao"
                placeholder="Descrição"
                value={newList.listaDescricao}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              <input //* Inserir participante quando já cria a lista (INCOMPLETO)
                style={{ height: '6vh', width: '15em', marginLeft: '4em', borderRadius: '1vh', marginBottom: '3vh' }}
                type="text"
                name="AddParticipant"
                placeholder="Compartilhar com:"
                value={newList.listaDescricao}
                onChange={handleInputChange}
              />
              <button
                onClick={handleCreateList}
                style={{ marginLeft: '5px', height: '7vh', width: '6vh', borderRadius: '2vh', backgroundColor: '#003049', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px' }}
              >
                +
              </button>
            </label>
            <br />
            <label>
              <input //* Inserir alguns Itens quando já se cria a lista (INCOMPLETO)
                style={{ height: '6vh', width: '15em', marginLeft: '4em', borderRadius: '1vh'}}
                type="text"
                name="AddItens" 
                placeholder="Itens"
                value={newList.listaDescricao}
                onChange={handleInputChange}
              />
              <button
                onClick={handleCreateList}
                style={{ marginLeft: '5px', height: '7vh', width: '6vh', borderRadius: '2vh', backgroundColor: '#003049', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px' }}
              >
                +
              </button>
            </label>
          </div>
          <button
            onClick={handleCreateList}
            style={{ marginTop: '2em', height: '6vh', width: '18em',  marginLeft: '3.7em', borderRadius: '1vh', backgroundColor: '#003049', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px' }}
          >
            Criar Lista
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default CreateList;