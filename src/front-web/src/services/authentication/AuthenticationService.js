import axios from 'axios';

const IS_PROD = false;
const STATUS_OK = 200;
const STATUS_CREATED = 201;

const apiInstance = axios.create({
    baseURL: IS_PROD ? '{{URL_PROD}}' : 'https://localhost:7150'
});

class AuthenticationService {

    async loginAsync(loginDto) {
        try {
            console.info("ConexaService.loginAsync -> Chamou o endpoint de login na API.");

            const response = await apiInstance.post("/gateway/authentication/users/validate", loginDto);

            console.info('ConexaService.loginAsync -> Resposta da API Connexa.', response);

            if (response.status != STATUS_OK)
                return null;

            return response.data;
        } catch (error) {
            console.error('ConexaService.loginAsync -> Erro ao chamar o endpoint de login da API Connexa.', error);
            return null;
        }
    }

    async createUserAsync(createUserDto) {
        try {
            console.info("ConexaService.createUserAsync -> Chamou o endpoint de criar usuário na API.", createUserDto);

            const response = await apiInstance.post("/gateway/authentication/users", createUserDto);

            console.info('ConexaService.createUserAsync -> Resposta da API Connexa.', response);

            return response.status == STATUS_CREATED;
        } catch (error) {
            console.error('ConexaService.createUserAsync -> Erro ao chamar o endpoint de login da API Connexa.', error);
            return false;
        }
    }

    async getSecretQuestionAsync(email) {
        try {
            console.info("AuthenticationService.getSecretQuestionAsync -> Chamou o endpoint para buscar a pergunta secreta na API.", email);

            const response = await apiInstance.get("/gateway/authentication/users/secret-question", {
                params: { email: email }  // Configuração correta dos parâmetros de consulta
            });

            console.info('AuthenticationService.getSecretQuestionAsync -> Resposta da API.', response);

            if (response.status != STATUS_OK)
                return null;

            return response.data;
        } catch (error) {
            console.error('AuthenticationService.getSecretQuestionAsync -> Erro ao buscar a pergunta secreta na API.', error);
            return null;
        }
    }

}

export default AuthenticationService;

