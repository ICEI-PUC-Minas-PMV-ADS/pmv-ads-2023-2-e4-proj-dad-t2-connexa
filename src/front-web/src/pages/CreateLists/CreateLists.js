import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Importe o ícone de saída
import { useNavigate, Link } from 'react-router-dom';
import logo from "../../img/logo.png";

function CreateLists({ handleLogout }) {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        localStorage.removeItem('isLogged');
        handleLogout(false); // Chama a função handleLogout para atualizar o estado
        navigate('/');
    };

    return (
        <div>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" noWrap sx={{ flex: 1 }}>
                    <Avatar src={logo} alt="Logo" sx={{ width: 40, height: 40, mr: 2 }} />
                </Typography>
                <Link to="/listas-contribuo" style={{ textDecoration: 'none', color: 'inherit', marginRight: '20px' }}>
                    Listas que Contribuo
                </Link>
                <Link to="/Home" style={{ textDecoration: 'none', color: 'inherit', marginRight: '20px' }}>
                    Minhas Listas
                </Link>
                <IconButton color="inherit" onClick={handleLogoutClick}>
                    <ExitToAppIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    </div>
    );
}
export default CreateLists;