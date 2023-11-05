import React from "react";
import Modal from "react-modal";
import { ToastContainer, TypeOptions, toast } from 'react-toastify';
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
      top: '50%',
      left: '50%',
      right: 'auto',
      botton: '50%',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
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

    if(result){
      let notificationType = toast.TYPE.INFO;

      if(result.includes("Usuário adicionado a lista de permissões")){
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
    <div className="container">
      <button className="modal-button" onClick={HandleModal}>
        Adicionar participante
      </button>
      <Modal
        isOpen={modalStatus}
        onRequestClose={HandleModal}
        style={customStyles}
      >
        <h2>Adicionar Participante</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <button onClick={handleSubmit}>Enviar</button>
        <button onClick={HandleModal}>Fechar</button>

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

export default AddParticipant;