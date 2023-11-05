import React, { ChangeEvent, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';
import { ListItemDTO } from '../../services/lists/dtos/ListItem';
import { getListItemsAsync, addItemListAsync } from '../../services/lists/listService';
import Item from './Item/item';
import Modal from 'react-modal';
import { Button, TextField } from '@mui/material';

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

    const handleAddItem = async () => {
        const item : ListItemDTO = {
            listaId: Number(idList),
            nome: name,
            descricao: description,
            id: 0,
            status: false,
            nomeLista: ''
        };
        console.log(item);
        const result = await addItemListAsync(Number(idList), item);

        if(result)
            setItems([...items, result]);
    }

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

    const [addModalIsOpen, setAddItemModalIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleBackToHome = () => {
        navigate('/');
    }

    const openAddItemModal = () => {
        setAddItemModalIsOpen(true);
    }

    const closeAddItemModal = () => {
        setAddItemModalIsOpen(false);
    }

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

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" noWrap sx={{ flex: 1 }}>
                        <IconButton color="inherit" onClick={handleBackToHome}>
                            <Avatar src='../../img/logo.png' alt="Logo" sx={{ width: 40, height: 40, mr: 2 }}/>
                        </IconButton>
                    </Typography>
                    <div>
                        <IconButton color="inherit" onClick={openAddItemModal}>
                            <AddIcon style={{color:'#7CFC00'}}/>
                            <label style={{fontSize: '0.8em'}}>Adicionar item</label>
                        </IconButton>
                        <IconButton color="inherit" onClick={handleLogoutClick}>
                            <ExitToAppIcon style={{color:'#D62828'}}/>
                        </IconButton>
                    </div>                   
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
                                <Item key={a.id} nameProp={a.nome} descriptionProp={a.descricao} checkedProp={a.status} id={a.id} />
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
                        <button onClick={handleAddItem}>Enviar</button>
                        <button onClick={closeModal}>Fechar</button>
                    </Modal>
                    <Modal
                        isOpen={addModalIsOpen}
                        onRequestClose={closeAddItemModal}
                        contentLabel="Adicionar item"
                        style={{
                            content: {
                              height:'auto',
                              width: '25%',
                              margin: 'auto',
                            },
                        }}
                    >
                        <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center' }}>
                            <h2>Adicionar item</h2>
                            <TextField
                                style={{ borderColor: '#003049'}}
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                style={{ borderColor: '#003049'}}
                                margin="normal"
                                required
                                fullWidth
                                id="description"
                                label="Description"
                                name="description"
                                autoComplete="description"
                                autoFocus
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Button
                                style={{backgroundColor:'#003049'}} 
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 1 }}
                                onClick={handleAddItem}
                            >
                                Adicionar item
                            </Button>
                            <Button
                                style={{backgroundColor:'#003049'}} 
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 1 }}
                                onClick={closeAddItemModal}
                            >
                                Fechar
                            </Button>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default ItemList;
