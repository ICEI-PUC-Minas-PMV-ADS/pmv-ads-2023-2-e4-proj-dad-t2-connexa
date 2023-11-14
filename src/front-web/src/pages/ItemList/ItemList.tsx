import React, { useCallback, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';
import { ListItemDTO } from '../../services/lists/dtos/ListItem';
import { getListItemsAsync, addItemListAsync, deleteListItemAsync } from '../../services/lists/listService';
import Item from './Item/item';
import Modal from 'react-modal';
import { Button, TextField } from '@mui/material';
import AddParticipant from './AddParticipant';
import { toast } from 'react-toastify';
import EditLists from '../EditLists/editList'
import ModeEdit from '@mui/icons-material/ModeEdit';

interface ItemListProps {
    handleLogout(bool: boolean): void;
    editMode : boolean;
}

function ItemList({ handleLogout, editMode }: ItemListProps) {
    const navigate = useNavigate();
    const { idList, titulo, descricao } = useParams();

    const [title, setTitle] = useState(titulo ?? '');
    const [description, setDescription] = useState(descricao ?? '');

    const selectedList = localStorage.getItem('selectedList');
    const [listItem, setListItem] = useState<ListItemDTO>({
        id: 0,
        nome: '',
        descricao: '',
        nomeLista: '',
        status: false,
        listaId: Number(idList)
    });

    const [items, setItems] = useState<ListItemDTO[]>([]);

    const handleLogoutClick = () => {
        localStorage.removeItem('isLogged');
        handleLogout(false);
        navigate('/');
    };

    const handleDeleteItem = async (id : number) => {
        const notify = toast.loading("Please wait...")
        var result = await deleteListItemAsync(Number(idList), id);
        if(result){
            setItems(items.filter((f) => f.id !== id));
            toast.update(notify, {
                render: "Item removido com sucesso.",
                type: toast.TYPE.SUCCESS,
                autoClose: 3000,
                closeButton: true,
                isLoading: false
            });
        }
    };

    const handleEditItem = (item : ListItemDTO) => {
        setListItem(item);
        openItemModal();
    };

    const getItems = useCallback(async () => {
        let itemsDb = await getListItemsAsync(Number(idList));
        if (itemsDb) {
            setItems(itemsDb);
        }
    }, [idList]);

    const updateListFieldsCallback = useCallback((title: string, description: string) => {
        setTitle(title);
        setDescription(description);
    }, []);

    const handleSaveItem = useCallback(async (item : ListItemDTO) => {
        const notify = toast.loading("Please wait...")
        const result = await addItemListAsync(Number(idList), item);
        if(result){
            getItems();
            closeItemModal();
            toast.update(notify, {
                render: "Item salvo com sucesso.",
                type: toast.TYPE.SUCCESS,
                autoClose: 3000,
                closeButton: true,
                isLoading: false
            });
        }
    }, [getItems, idList]);

    useEffect(() => {
        getItems();
        if(selectedList)
            console.log(JSON.parse(selectedList));
    }, [getItems, idList, selectedList]);

    const [addModalIsOpen, setAddItemModalIsOpen] = useState(false);

    const handleBackToHome = () => {
        navigate('/');
    }

    const resetListItemFields = () => {
        setListItem({
            id: 0,
            nome: '',
            descricao: '',
            nomeLista: '',
            status: false,
            listaId: Number(idList)
        })
    }

    const openItemModal = () => {
        setAddItemModalIsOpen(true);
    }

    const closeItemModal = () => {
        setAddItemModalIsOpen(false);
    }

    return (
        <div>
            <AppBar style={{ backgroundColor: '#003049' }} position="static">
                <Toolbar>
                    <Typography variant="h6" noWrap sx={{ flex: 1 }}>
                        <IconButton color="inherit" onClick={handleBackToHome}>
                            <Avatar src='../../img/logo.png' alt="Logo" sx={{ width: 40, height: 40, mr: 2 }}/>
                        </IconButton>
                    </Typography>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {
                            editMode ? <EditLists updateListFieldsCallback={updateListFieldsCallback} listTitle={title} listDescription={description}/> : (<div></div>)
                        }
                        <AddParticipant idLista={idList}/>
                        <IconButton color="inherit" onClick={() => {
                            resetListItemFields();
                            openItemModal();
                            }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', margin: '2rem 0px' }}>
                    <label style={{ fontSize: '3em' }}>{title}</label>
                    <label style={{ fontSize: '2em' }}>{description}</label>
                </div>
                <div>
                    {
                        items.map((a: ListItemDTO) => {
                            return (
                                <Item key={a.id} editMode={editMode} item={a} deleteItemCallback={handleDeleteItem} editItemCallback={handleEditItem}/>
                            )
                        })
                    }
                </div>
                <div>
                    <Modal
                        isOpen={addModalIsOpen}
                        onRequestClose={closeItemModal}
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
                                value={listItem.nome}
                                onChange={(e) => setListItem({...listItem, nome: e.target.value})}
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
                                value={listItem.descricao}
                                onChange={(e) => setListItem({...listItem, descricao: e.target.value})}
                            />
                            <Button
                                style={{backgroundColor:'#003049'}} 
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 1 }}
                                onClick={
                                    () => handleSaveItem(listItem)
                                }
                            >
                                Salvar item
                            </Button>
                            <Button
                                style={{backgroundColor:'#003049'}} 
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 1 }}
                                onClick={closeItemModal}
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
