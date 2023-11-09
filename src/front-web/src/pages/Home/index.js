import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate, Link } from 'react-router-dom';
import logo from "../../img/logo.png";
import ListaItens from './listComponent.tsx';
import CreateList from './../CreateLists/createcomponent.js';

function Home({ handleLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem('isLogged');
    handleLogout(false);
    navigate('/');
  };

  return (
    <div>
      <AppBar style={{ backgroundColor: '#003049' }} position="static">
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flex: 1 }}>
            <Avatar src={logo} alt="Logo" sx={{ width: 40, height: 40, mr: 2 }} />
          </Typography>
          <CreateList  />
          <IconButton color="inherit" onClick={handleLogoutClick}>
            <ExitToAppIcon style={{ color: '#D62828' }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <div>
        <ListaItens />
      </div>
    </div>
  );
}

export default Home;