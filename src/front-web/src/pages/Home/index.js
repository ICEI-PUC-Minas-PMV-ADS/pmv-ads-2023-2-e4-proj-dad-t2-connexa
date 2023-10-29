import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Importe o ícone de saída
import { useNavigate, Link } from 'react-router-dom';
import logo from "../../img/logo.png";
import ListaItens from './listcomponent';

function Home({ handleLogout }) {
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
                <Link to="/criar-lista" style={{ textDecoration: 'none', color: 'inherit', marginRight: '20px' }}>
                    Criar Lista
                </Link>
                <IconButton color="inherit" onClick={handleLogoutClick}>
                    <ExitToAppIcon />
                </IconButton>
            </Toolbar>
        </AppBar>

        <div>
            <Typography variant="h4" component="h2" gutterBottom>
                Minhas Listas
            </Typography>

            <ListaItens/>
        </div>
    </div>
    );
}

export default Home;