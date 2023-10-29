import axios from 'axios';

const IS_PROD = false;
const STATUS_OK = 200;
const STATUS_CREATED = 201;

const apiInstance = axios.create({
    baseURL: IS_PROD ? '{{URL_PROD}}' : 'https://localhost:7150'
});

class ListsService {

    async getListItemsAsync(id) {
        try {
            console.info("ListsService.getListItemsAsync -> Chamou o endpoint para buscar os items da lista na API", id);

            const response = await apiInstance.get(`/lists/${id}/items`);

            console.info('ListsService.getListItemsAsync -> Resposta da API.', response);

            if (response.status != STATUS_OK)
                return null;

            return response.data;
        } catch (error) {
            console.error('ListsService.getListItemsAsync -> Erro ao buscar os items da API.', error);
            return null;
        }
    }

    async getListByOwner(idOwner){
        try {
            console.info("ListsService.getListByOwner -> Chamou o endpoint para buscar as listas usando o ID do criador dela na API", idOwner);

            const response = await apiInstance.get(`/gateway/list/lists/owner/${idOwner}`);

            console.info('ListsService.getListByOwner -> Resposta da API.', response);

            if (response.status != STATUS_OK)
                return null;

            return response.data;
        } catch (error) {
            console.error('ListsService.getListByOwner -> Erro ao buscar as listas da API.', error);
            return null;
        }
    }

}

export default ListsService;
