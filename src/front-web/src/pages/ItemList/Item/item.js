import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Importe o ícone de saída
import { useNavigate } from 'react-router-dom';
import logo from "../../img/logo.png";

function Item({item}) {
    return (
        <div>
            <label>{item.name}</label>
            <label>{item.selected}</label>
        </div>
    )
}

export default Item;