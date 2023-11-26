import axios, { AxiosResponse } from 'axios';
import { CreateListDTO } from './dtos/CreateListDto';
import { ListItemDTO } from './dtos/ListItem';

const IS_PROD = false;
const STATUS_OK = 200;

const apiInstance = axios.create({
  baseURL: IS_PROD ? '{{URL_PROD}}' : 'http://192.168.18.12:7151/gateway',
});

export const getListItemsAsync = async (listaId: number) => {
  try {
    console.info('ListsService.getListItemsAsync -> Chamou o endpoint para buscar os items da lista na API', listaId);

    const response: AxiosResponse<ListItemDTO[]> = await apiInstance.get(`/list/lists/${listaId}/items`);

    console.info('ListsService.getListItemsAsync -> Resposta da API.', response);

    if (response.status === STATUS_OK) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error('ListsService.getListItemsAsync -> Erro ao buscar os items da API.', error);
    return null;
  }
};

export const saveCreateListAsync = async (newList: CreateListDTO) => {
  try {
    console.info('ListsService.postCreateList -> Chamou o endpoint para criar uma lista', newList);

    const response: AxiosResponse<CreateListDTO> = await apiInstance.post('/list/lists', newList);
    console.info('ListsService.postCreateList -> Resposta da API.', response);

    if (response.status === STATUS_OK) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.info('ListsService.postCreateList -> Erro ao tentar salvar uma lista', error);
    return null;
  }
};