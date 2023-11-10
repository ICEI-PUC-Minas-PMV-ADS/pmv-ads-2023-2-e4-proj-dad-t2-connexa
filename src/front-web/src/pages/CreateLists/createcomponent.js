import React, { useState } from 'react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postCreateListAsync } from '../../services/lists/listService';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewList({
      ...newList,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleCreateList = async () => {
    if (newList.listaTitulo.trim() === '') {
      toast.error('Sua lista precisa de um nome');
      return;
    }

    try {
      console.info('Chamou a função para criar uma nova lista na API');

      const response = await postCreateListAsync(newList);

      if (response) {
        toast.success('Nova lista criada com sucesso');
        setIsModalOpen(false); // Fecha o modal após criar a lista
      } else {
        toast.error('Erro ao criar a lista na API');
      }
    } catch (error) {
      console.error('Erro ao criar a lista na API:', error);
      toast.error('Erro ao criar a lista na API');
    }
  };

  const openCreateListPopup = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <Button
        style={{ backgroundColor: '#003049', textDecoration: 'none', color: 'inherit', marginRight: '20px', border: 'none', cursor: 'pointer', fontSize: '16px' }}
        onClick={openCreateListPopup}
      >
        Criar Lista
      </Button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Criar Nova Lista"
        style={{
          content: {
            height: '60%',
            width: '26%',
            margin: 'auto',
          },
        }}
      >
        <div>
          <p style={{ fontSize: '2em', marginLeft: '1em', color:'#003049' }}>Criar uma nova lista</p>
          <div className="inputs">
            <TextField
              style={{ borderColor: '#003049', height: '40px', width: '90%', borderRadius: '4px', marginBottom: '10px', paddingLeft: '1em' }}
              type="text"
              placeholder=" "
              name="listaTitulo"
              value={newList.listaTitulo}
              onChange={handleInputChange}
              onFocus={() => handleFocus('listaTitulo')}
              onBlur={handleBlur}
              InputLabelProps={{
                shrink: focusedField === 'listaTitulo' || newList.listaTitulo,
                style: { marginLeft: '1em' }
              }}
              label="Nome da Lista*"
            />
            <br />
            <TextField
              style={{  marginTop: '4vh', borderColor: '#003049', height: '40px', width: '90%', borderRadius: '4px', marginBottom: '10px',  paddingLeft: '1em' }}
              type="text"
              placeholder=" "
              name="listaDescricao"
              value={newList.listaDescricao}
              onChange={handleInputChange}
              onFocus={() => handleFocus('listaDescricao')}
              onBlur={handleBlur}
              InputLabelProps={{ 
                shrink: focusedField === 'listaDescricao' || newList.listaDescricao,
                style: { marginLeft: '1em' }
              }}
              label = "Descrição*"
            />
          </div>
          <Button
            onClick={handleCreateList}
            style={{ marginTop: '2em', height: '50px', width: '90.1%', borderRadius: '4px',  marginLeft: '1.1em', backgroundColor: '#003049', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px' }}
          >
            Salvar
          </Button>
        </div>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default CreateList;
