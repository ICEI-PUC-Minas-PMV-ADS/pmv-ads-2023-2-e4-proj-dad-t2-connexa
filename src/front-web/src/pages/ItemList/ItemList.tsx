import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { ListItemDTO } from '../../services/lists/dtos/ListItem';
import { getListItemsAsync } from '../../services/lists/listService';
import Item from './Item/item';

interface ItemListProps {
    handleLogout(bool : boolean) : void;
    idList : number;
}

function ItemList({ handleLogout, idList } : ItemListProps) {
    const navigate = useNavigate();

    const [items, setItems] = useState<ListItemDTO[]>([]);

    const handleLogoutClick = () => {
        localStorage.removeItem('isLogged');
        handleLogout(false); // Chama a função handleLogout para atualizar o estado
        navigate('/');
    };

    useEffect(() => {
        const getItems = async () => { 
            let itemsDb = await getListItemsAsync(idList);
            console.log(itemsDb);
            if (itemsDb) {
                setItems(itemsDb);
            }
        };
        getItems();
    }, [idList]);

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
            <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center', textAlign: 'center'}}>
                <div style={{margin: '2rem 0px'}}>
                    <label style={{fontSize: '3em'}}>{items.length > 0 ? items[0].nomeLista : "Nome da lista"}</label>
                </div>
                <div>
                {
                    items.map((a : ListItemDTO) => {
                        return (
                            <Item key={a.id} nameProp={a.nome} checkedProp={a.status} id={a.id} />
                        )
                    })
                }
                </div>
            </div>
        </div>
    );
}

export default ItemList;
