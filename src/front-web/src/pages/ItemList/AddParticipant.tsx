import React from "react";
import Modal from "react-modal";
import { Button, TextField } from '@mui/material';
import { ToastContainer, TypeOptions, toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { addUserLista } from "../../services/permission/NewUserListaService";

Modal.setAppElement('#root')

function AddParticipant(props: { idLista: string | undefined }) {
  const [modalStatus, setModalStatus] = useState(false)
  const [email, setEmail] = useState("");
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  let idListaInt = 0
  if (typeof (props.idLista) === "string") {
    idListaInt = parseInt(props.idLista)
  }
  else {
    throw new Error("Não foi possível resgatar o id da lista.");
  }

  function HandleModal() {
    if (modalStatus === false) {
      setModalStatus(true)
    } else {
      setModalStatus(false)
    }
  }

  const customStyles = {
    content: {
      height: 'auto',
      width: '25%',
      margin: 'auto',
    }
  }

  const [newUserLista, setNewUserLista] = useState({
    userEmail: email,
    listaId: idListaInt,
    userListaRole: 2
  });

  const handleSubmit = async () => {
    const notify = toast.loading("Please wait...")
    newUserLista.userEmail = email
    let result = await addUserLista(newUserLista);

    if (result) {
      let notificationType = toast.TYPE.INFO;

      if (result.includes("Usuário adicionado a lista de permissões")) {
        notificationType = toast.TYPE.SUCCESS;
      }

      toast.update(notify, {
        render: result,
        type: notificationType,
        autoClose: 4000,
        closeButton: true,
        isLoading: false
      });
    }
  }

  return (
    <>
      <IconButton color="inherit" onClick={HandleModal}>
        <AddIcon style={{ color: '#7CFC00' }} />
        <label style={{ fontSize: '0.8em' }}>Adicionar Participante</label>
      </IconButton>
      <Modal
        isOpen={modalStatus}
        onRequestClose={HandleModal}
        style={customStyles}
      >
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center' }}>
          <h2>Adicionar Participante</h2>
          <TextField
            style={{ borderColor: '#003049' }}
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleEmailChange}
          />
          <Button
            style={{ backgroundColor: '#003049' }}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 1 }}
            onClick={handleSubmit}
          >
            Convidar
          </Button>
          <Button
            style={{ backgroundColor: '#003049' }}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 1 }}
            onClick={HandleModal}
          >
            Fechar
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
    </>
    // 
    //   <button className="modal-button" onClick={HandleModal}>
    //     Adicionar participante
    //   </button>
    
    // </div>
  );
}

export default AddParticipant;