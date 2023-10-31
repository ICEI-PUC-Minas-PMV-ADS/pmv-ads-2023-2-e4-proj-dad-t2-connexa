import axios from 'axios';
import { ListItemDTO } from './dtos/ListItem';
import { CreateListDTO } from './dtos/CreateListDto';

const IS_PROD = false;
const STATUS_OK = 200;

const apiInstance = axios.create({
    baseURL: IS_PROD ? '{{URL_PROD}}' : 'https://localhost:7150/gateway'
});

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

export const checkListItem = async (idItem : number, checked : boolean) => {
    try {
        console.info("ListsService.checkListItem -> Chamou o endpoint para buscar os items da lista na API", idItem);

        const response = await apiInstance.put<boolean>(`/list/lists/itemList/${idItem}/${checked}`);

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

        const response = await apiInstance.get<number>(`/list/lists/owner/${idOwner}`);

        console.info('ListsService.getListByOwner -> Resposta da API.', response);

        if (response.status != STATUS_OK)
            return null;

        return response.data;
    } catch (error) {
        console.error('ListsService.getListByOwner -> Erro ao buscar as listas da API.', error);
        return null;
    }
}

export const getListParticipant = async (idparticipant: number) => {
    try {   
        console.info("ListsService.getListParticipant -> Chamou o endpoint para buscar as listas usando o ID do membro na API", idparticipant);

        const response = await apiInstance.get(`/list/lists/participant/${idparticipant}`);

        console.info('ListsService.getListParticipant -> Resposta da API.', response);

        if (response.status === STATUS_OK) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.error('ListsService.getListParticipant -> Erro ao buscar as listas da API.', error);
        return null;
    }
}



export const postCreateList = async (newList: CreateListDTO) => { 
    try {
        console.log("Chamou o endpoint para criar uma nova lista na API");

        const response = await apiInstance.post('/list/lists', newList);
        console.log('Resposta da API:', response.data);

        if (response.status === STATUS_OK) {
            return response.data;
        }

        return null;
    } catch (error) {
        console.error('Erro ao criar a lista na API:', error);
        return null;
    }
};