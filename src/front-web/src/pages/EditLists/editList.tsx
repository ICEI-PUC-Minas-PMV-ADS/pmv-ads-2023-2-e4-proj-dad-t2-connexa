import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { postCreateListAsync } from '../../services/lists/listService';
import { CreateListDTO } from '../../services/lists/dtos/CreateListDto';
import { Button, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');

interface EditListProps {
  updateListFieldsCallback(title: string, description: string):void;
  listTitle: string;
  listDescription: string;
}

function EditList({listTitle, listDescription, updateListFieldsCallback} : EditListProps) {
  const idOwner = localStorage.getItem('userId') ?? 0;
  
  const [selectedList, setSelectedList] = useState<CreateListDTO>()
  useEffect(() => {
    setSelectedList(JSON.parse(localStorage.getItem('selectedList')!) ?? null)
  }, [])

  const [title, setTitle] = useState<string>(listTitle);
  const [description, setDescription] = useState<string>(listDescription);

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCreateList = async () => {
    if (title?.trim() === '') {
      alert('Sua lista precisa de um nome.');
      return;
    }

    if (description?.trim() === '') {
      alert('Sua lista precisa de uma descrição..');
      return;
    }

    if(selectedList && description && title){
      const list: CreateListDTO = {
        listaId: selectedList.listaId,
        userId: selectedList.userId,
        listaPublica: selectedList.listaPublica,
        listaStatus: selectedList.listaStatus,
        listaDescricao: description,
        listaTitulo: title,
        message: '',
      };
  
      const response = await postCreateListAsync(list);
  
      if (response) {
        toast.success("Lista salva com sucesso.", {
          type: toast.TYPE.SUCCESS,
          autoClose: 3000,
          closeButton: true,
          isLoading: false
        });
        updateListFieldsCallback(response.listaTitulo, response.listaDescricao);
        setIsModalOpen(false);
      }
    }
  };
  const openCreateListPopup = () => {
    setIsModalOpen(true);
  };

  return (
    <div>

      {
        selectedList?.userId == idOwner ? 
        (
          <IconButton color="inherit" onClick={openCreateListPopup}>
            <AddIcon style={{ color: '#7CFC00' }} />
            <label style={{ fontSize: '0.8em' }}>Editar Lista</label>
          </IconButton>
        ) : (<div/>)
      }

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
        <div style={{textAlign: 'center'}}>
          <h2>Adicionar Participante</h2>
          <div>
            <TextField
              style={{ borderColor: '#003049' }}
              margin="normal"
              required
              fullWidth
              id="titulo"
              label="Titulo"
              name="titulo"
              autoComplete="titulo"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              style={{ borderColor: '#003049' }}
              margin="normal"
              required
              fullWidth
              id="descricao"
              label="Descrição"
              name="descricao"
              autoComplete="descricao"
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button
              style={{ backgroundColor: '#003049' }}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1 }}
              onClick={handleCreateList}
              >
              Salvar
            </Button>
            <Button
              style={{ backgroundColor: '#003049' }}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 1 }}
              onClick={() => setIsModalOpen(false)}
            >
              Fechar
            </Button>
            </div>
        </div>
      </Modal>
    </div>
  );
}

export default EditList;