import React, { useState, useEffect } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import logo from "../../img/logo.png";
import Popup from "reactjs-popup";
import ListsService from "../../services/lists/ListsService"
import NewUserListDTO from "../../services/lists/dtos/NewUserListaDTO";

function Home({ handleLogout }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleLogoutClick = () => {
        localStorage.removeItem('isLogged');
        handleLogout(false);
        navigate('/');
    };

    const handleClick = () => {
        setIsPopupOpen(true);
    };

    const handleSubmit = async () => {
        const listsService = new ListsService();
        const newUserListDTO = new NewUserListDTO(1, 34);
        const response = await listsService.addParticipant(newUserListDTO);

        if (response) {
            setEmail("");
            alert("Participante adicionado a lista");
        } else {
            alert("Participante não encontrado");
        }
    };

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
            <div>
                <Button onClick={handleClick}>Adicionar participante</Button>
                <Popup
                    class="my-popup"
                    open={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    width={400}
                    height={200}
                >
                    <h2>Adicionar participante</h2>
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleSubmit}>Enviar</button>
                    <button onClick={() => setIsPopupOpen(false)}>Fechar</button>
                </Popup>
            </div>
        </div>
    );
}
export default Home;