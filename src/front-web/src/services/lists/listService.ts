import axios from 'axios';
import { ListItemDTO } from './dtos/ListItem';
import { CreateListDTO } from './dtos/CreateListDto';
import { ListDTO } from '../../types/ListDTO';

const IS_PROD = false;
const STATUS_OK = 200;

const apiInstance = axios.create({
    baseURL: IS_PROD ? '{{URL_PROD}}' : 'https://connexagatewayapi.azurewebsites.net/gateway'
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

export const saveItemListAsync = async (idList : number, item : ListItemDTO) => {
    try {
        console.info("ListsService.addItemListAsync -> Chamou o endpoint para salvar um item na lista", item);

        const response = await apiInstance.post<ListItemDTO>(`/list/lists/${idList}/items`, item);

        console.info('ListsService.addItemListAsync -> Resposta da API.', response);

        if (response.status !== STATUS_OK)
            return null;
        return response.data;
    } catch (error) {
        console.error('ListsService.addItemListAsync -> Erro ao tentar salvar o item da api.', error);
        return null;
    }

}

export const getListsByOwnerOrParticipant = async (idOwner : number) => {
    try {
        console.info("ListsService.getListByOwner -> Chamou o endpoint para buscar as listas usando o ID do criador dela na API", idOwner);

        const response = await apiInstance.get<ListDTO[]>(`/list/lists/relateds/${idOwner}`);

        console.info('ListsService.getListByOwner -> Resposta da API.', response);

        if (response.status !== STATUS_OK)
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

export const deleteListItemAsync = async (idList : number, idItem : number) => {
    try {
        console.info("ListsService.deleteListItemAsync -> Chamou o endpoint para deletar um item da lista", idItem);

        const response = await apiInstance.delete<boolean>(`/list/lists/${idList}/${idItem}`);

        console.info('ListsService.deleteListItemAsync -> Resposta da API.', response);

        if (response.status !== STATUS_OK)
            return null;
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('ListsService.deleteListItemAsync -> Erro ao tentar deletar o item da api.', error);
        return null;
    }

}

export const deleteListAsync = async (idList : number) => {
    try {
        console.info("ListsService.deleteListAsync -> Chamou o endpoint para deletar a lista", idList);

        const response = await apiInstance.delete<boolean>(`/list/lists/${idList}`);

        console.info('ListsService.deleteListAsync -> Resposta da API.', response);

        if (response.status !== STATUS_OK)
            return null;
        return response.data;
    } catch (error) {
        console.error('ListsService.deleteListAsync -> Erro ao tentar deletar a lista.', error);
        return null;
    }

}

export const deleteParticipantAsync = async (idParticipant : number) => {
    try {
        console.info("ListsService.deleteParticipantAsync -> Chamou o endpoint para deletar o participante", idParticipant);

        const response = await apiInstance.delete<boolean>(`/list/member/${idParticipant}`);

        console.info('ListsService.deleteParticipantAsync -> Resposta da API.', response);

        if (response.status !== STATUS_OK)
            return null;
        return response.data;
    } catch (error) {
        console.error('ListsService.deleteParticipantAsync -> Erro ao tentar deletar o participante.', error);
        return null;
    }

}