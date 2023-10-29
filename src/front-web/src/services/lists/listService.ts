import axios from 'axios';
import { ListItemDTO } from './dtos/ListItem';

const IS_PROD = false;
const STATUS_OK = 200;
const STATUS_CREATED = 201;

const apiInstance = axios.create({
    baseURL: IS_PROD ? '{{URL_PROD}}' : 'https://localhost:7150'
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

export const getListByOwner = async (idOwner : number) => {
    try {
        console.info("ListsService.getListByOwner -> Chamou o endpoint para buscar as listas usando o ID do criador dela na API", idOwner);

        const response = await apiInstance.get<number>(`/gateway/list/lists/owner/${idOwner}`);

        console.info('ListsService.getListByOwner -> Resposta da API.', response);

        if (response.status != STATUS_OK)
            return null;

        return response.data;
    } catch (error) {
        console.error('ListsService.getListByOwner -> Erro ao buscar as listas da API.', error);
        return null;
    }
}
