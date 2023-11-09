import * as React from 'react';
import EditList from './editComponent';

interface EditListsProps {}

const EditLists: React.FC<EditListsProps> = () => {
    return (
        <div>
            <div>
                <EditList />
            </div>
        </div>
    );
};

export default EditLists;