import axios from 'axios';

const IS_PROD = false;
const STATUS_OK = 200;

const apiInstance = axios.create({
    baseURL: IS_PROD ? '{{URL_PROD}}' : 'https://localhost:7150'
});
class NewUserListaService {
    async addUserLista(newUserListaDTO) {
        try {
            console.info("ConexaService.loginAsync -> Chamou o endpoint de newUserLista na API.");

            const response = await apiInstance.post("/gateway/permission/permission", newUserListaDTO);

            console.info('ConexaService.loginAsync -> Resposta da API Connexa.', response);

            if (response.status != STATUS_OK)
                return null;

            return response.data;
        } catch (error) {
            console.error('ConexaService.loginAsync -> Erro ao chamar o endpoint de newUserLista da API Connexa.', error);
            return null;
        }
    }
}

export default NewUserListaService;