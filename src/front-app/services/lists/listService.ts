import axios, { AxiosResponse } from 'axios';
import { CreateListDTO } from './dtos/CreateListDto';
import { ListItemDTO } from './dtos/ListItem';

const IS_PROD = false;
const STATUS_OK = 200;

const apiInstance = axios.create({
    baseURL: IS_PROD ? '{{URL_PROD}}' : 'https://192.168.18.1:7150/gateway'
});

export const saveCreateListAsync = async (newList: CreateListDTO) => { 
    try {
        console.info("ListsService.postCreateList -> Chamou o endpoint para criar uma lista", newList);

        const response: AxiosResponse<CreateListDTO>= await apiInstance.post('/lists', newList);
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

export const getListItemsAsync = async (id : number) => {
    try {
        console.info("ListsService.getListItemsAsync -> Chamou o endpoint para buscar os items da lista na API", id);

        const response = await apiInstance.get<ListItemDTO[]>(`/list/lists/${id}/items`);

        console.info('ListsService.getListItemsAsync -> Resposta da API.', response);

        if (response.status !== STATUS_OK)
            return null;
        return response.data;
    } catch (error) {
        console.error('ListsService.getListItemsAsync -> Erro ao buscar os items da API.', error);
        return null;
    }
}