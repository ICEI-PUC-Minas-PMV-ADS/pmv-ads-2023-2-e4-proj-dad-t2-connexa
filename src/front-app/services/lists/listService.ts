import axios, { AxiosResponse } from 'axios';
import { CreateListDTO } from './dtos/CreateListDto';
import { ListItemDTO } from './dtos/ListItem';
import { ListDTO } from './dtos/ListDTO';

const IS_PROD = false;
const STATUS_OK = 200;
const localLucas = "http://192.168.2.4:7151";

const apiInstance = axios.create({
    baseURL: IS_PROD ? '{{URL_PROD}}' : localLucas + '/gateway'
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
}

export const getListItemsAsync = async (id : number) => {
    try {
        console.log('Esse é o ID', id)
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

