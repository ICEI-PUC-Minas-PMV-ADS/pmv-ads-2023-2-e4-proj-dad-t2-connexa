import React, { ChangeEvent, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate, useParams } from 'react-router-dom';
import { ListItemDTO } from '../../services/lists/dtos/ListItem';
import { getListItemsAsync } from '../../services/lists/listService';
import Item from './Item/item';
import Modal from 'react-modal';

Modal.setAppElement('#root');

interface ItemListProps {
    handleLogout(bool: boolean): void;
}

function ItemList({ handleLogout, }: ItemListProps) {
    const navigate = useNavigate();
    const { idList } = useParams();

    const [items, setItems] = useState<ListItemDTO[]>([]);

    const handleLogoutClick = () => {
        localStorage.removeItem('isLogged');
        handleLogout(false); // Chama a função handleLogout para atualizar o estado
        navigate('/');
    };

    useEffect(() => {
        const getItems = async () => {
            let itemsDb = await getListItemsAsync(Number(idList));
            console.log(itemsDb);
            if (itemsDb) {
                setItems(itemsDb);
            }
        };
        getItems();
    }, [idList]);


    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [email, setEmail] = useState('');

    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleEnviarClick = () => {
        // Aqui você pode definir o que fazer quando o botão "Enviar" é clicado
        //criar
        console.log(`Enviando email: ${email}`);
        // Adicione sua lógica de envio aqui
        // closeModal();
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" noWrap sx={{ flex: 1 }}>
                        <Avatar src='../../img/logo.png' alt="Logo" sx={{ width: 40, height: 40, mr: 2 }} />
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogoutClick}>
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', textAlign: 'center' }}>
                <div style={{ margin: '2rem 0px' }}>
                    <label style={{ fontSize: '3em' }}>{items.length > 0 ? items[0].nomeLista : "Nome da lista"}</label>
                </div>
                <div>
                    {
                        items.map((a: ListItemDTO) => {
                            return (
                                <Item key={a.id} nameProp={a.nome} checkedProp={a.status} id={a.id} />
                            )
                        })
                    }
                </div>
                <div>
                    <button onClick={openModal}>Adicionar Participante</button>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="Adicionar Participante"
                    >
                        <h2>Adicionar Participante</h2>
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <button onClick={handleEnviarClick}>Enviar</button>
                        <button onClick={closeModal}>Fechar</button>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default ItemList;
