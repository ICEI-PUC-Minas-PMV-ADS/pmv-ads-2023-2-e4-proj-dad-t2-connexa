import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Importe o ícone de saída
import { useNavigate } from 'react-router-dom';
import logo from "../../img/logo.png";
import ListsService from '../../services/lists/ListsService';

function ItemList({ handleLogout, idList }) {
    const navigate = useNavigate();

    const [items, setItems] = React.useState([]);

    const listService = new ListsService();

    const handleLogoutClick = () => {
        localStorage.removeItem('isLogged');
        handleLogout(false); // Chama a função handleLogout para atualizar o estado
        navigate('/');
    };

    React.useEffect(async () => {
        var itemDb = await listService.getListItemsAsync(idList);
        if(itemDb){
            setItems(items);
            console.log(items);
        }
    }, [idList])

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" noWrap sx={{ flex: 1 }}>
                        <Avatar src={logo} alt="Logo" sx={{ width: 40, height: 40, mr: 2 }} />
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogoutClick}>
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default ItemList;
