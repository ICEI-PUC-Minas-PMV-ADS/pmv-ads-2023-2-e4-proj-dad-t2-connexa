import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import {checkListItem} from '../../../services/lists/listService';
import { ListItemDTO } from '../../../services/lists/dtos/ListItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { toast } from 'react-toastify';

interface ItemProps {
    item : ListItemDTO;
    editMode : boolean;
    deleteItemCallback(id : number): void;
    editItemCallback(item : ListItemDTO): void;
}

function Item({item, editMode, editItemCallback, deleteItemCallback } : ItemProps) {

    const [checked, setChecked] = useState<boolean>(item.status);

    const setCheckChoose = async (event : React.ChangeEvent<HTMLInputElement>, checked : boolean) => {
        const notify = toast.loading("Please wait...")
        setChecked(checked);
        var result = await checkListItem(item.id, checked);
        if(result){
            toast.update(notify, {
                render: `Item ${checked ? "marcado" : "desmarcado" } com sucesso.`,
                type: toast.TYPE.SUCCESS,
                autoClose: 3000,
                closeButton: true,
                isLoading: false
            });
        }
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '5px 50px', borderRadius: '10px', backgroundColor: 'whitesmoke', padding: '10px'}}>
            <div style={{alignItems: 'center', textAlign: 'start'}}>
                <Typography component="h1" variant="h5">
                {item.nome}
                </Typography>
                <Typography component="p" variant='h6'>
                {item.descricao}
                </Typography>
            </div>           
            {
                !editMode ? (<Checkbox checked={checked} onChange={setCheckChoose} color='success'/>) : (
                    <div style={{ display: 'flex' }}>
                    <IconButton>
                        <EditIcon onClick={() => editItemCallback(item)}/>
                    </IconButton>
                    <IconButton>
                        <DeleteIcon onClick={() => deleteItemCallback(item.id)}/>
                    </IconButton>
                    </div>
                )
            }
            
        </div>
    )
}

export default Item;