import axios from 'axios';
import { UserListaRequestDTO } from './dtos/NewUserListaDTO';

const IS_PROD = true;
const STATUS_OK = 200;

const apiInstance = axios.create({
    baseURL: IS_PROD ? 'https://connexa-puc.azurewebsites.net/gateway' : 'https://localhost:7150/gateway'
});

export const addUserLista = async (userListaDTO : UserListaRequestDTO) => {
    try {
        console.log("Chamou o endpoint para criar uma nova lista na API");

        const response = await apiInstance.post('/permission/permission', userListaDTO);
        console.log('Resposta da API:', response.data);

        if (response.status === STATUS_OK) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.error('Erro ao criar a lista na API:', error);
        return null;
    }
}