import axios from 'axios';
import { ListItemDTO } from './dtos/ListItem';

const STATUS_OK = 200;

const apiInstance = axios.create({
    baseURL: 'https://localhost:7150/gateway/list'
});


export const getListItemsAsync = async (id : number) => {
    try {
        console.info("ListsService.getListItemsAsync -> Chamou o endpoint para buscar os items da lista na API", id);

        const response = await apiInstance.get<ListItemDTO[]>(`/lists/${id}/items`);

        console.info('ListsService.getListItemsAsync -> Resposta da API.', response);

        if (response.status !== STATUS_OK)
            return null;
        return response.data;
    } catch (error) {
        console.error('ListsService.getListItemsAsync -> Erro ao buscar os items da API.', error);
        return null;
    }
}

export const checkListItem = async (idItem : number, checked : boolean) => {
    try {
        console.info("ListsService.checkListItem -> Chamou o endpoint para buscar os items da lista na API", idItem);

        const response = await apiInstance.put<boolean>(`/lists/itemList/${idItem}/${checked}`);

        console.info('ListsService.checkListItem -> Resposta da API.', response);

        if (response.status !== STATUS_OK)
            return null;
        return response.data;
    } catch (error) {
        console.error('ListsService.checkListItem -> Erro ao buscar os items da API.', error);
        return null;
    }
}
