import axios from 'axios';
import { CreateListDTO } from './dtos/CreateListDto';


const IS_PROD = false;
const STATUS_OK = 200;

const apiInstance = axios.create({
    baseURL: IS_PROD ? '{{URL_PROD}}' : 'https://localhost:7150/gateway'
});

export const saveCreateListAsync = async (newList: CreateListDTO) => { 
    try {
        console.info("ListsService.postCreateList -> Chamou o endpoint para criar uma lista", newList);

        const response = await apiInstance.post<CreateListDTO>('/list/lists', newList);
        console.info('ListsService.postCreateList -> Resposta da API.', response);

        if (response.status === STATUS_OK) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.info("ListsService.postCreateList -> Erro ao tentar salvar uma lista", error);
        return null;
    }
};