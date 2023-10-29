import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import {checkListItem} from '../../../services/lists/listService';

interface ItemProps {
    id : number;
    nameProp :string;
    checkedProp : boolean;
}

function Item({nameProp, checkedProp, id} : ItemProps) {

    const [name, setName] = useState<string>(nameProp);
    const [checked, setChecked] = useState<boolean>(checkedProp);

    const setCheckChoose = async (event : React.ChangeEvent<HTMLInputElement>, checked : boolean) => {
        setChecked(checked);
        await checkListItem(id, checked);
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row', textAlign: 'center', alignContent: 'center', justifyContent: 'space-between', margin: '5px 50px', borderRadius: '10px', backgroundColor: 'whitesmoke', padding: '10px'}}>
            <Typography component="h1" variant="h5">
            {name}
            </Typography>
            <Checkbox checked={checked} onChange={setCheckChoose} color='success'/>
        </div>
    )
}

export default Item;