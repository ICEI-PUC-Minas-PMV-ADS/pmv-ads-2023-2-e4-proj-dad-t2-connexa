import axios from 'axios';

const STATUS_OK = 200;

const apiInstance = axios.create({
    baseURL: 'https://localhost:7150/gateway/list'
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

}

export default ListsService;
