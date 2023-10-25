import axios from 'axios';

const IS_PROD = false;
const STATUS_OK = 200;
const STATUS_CREATED = 201;

const apiInstance = axios.create({
    baseURL: IS_PROD ? '{{URL_PROD}}' : 'https://localhost:7100'
});

class AuthenticationService {

    async loginAsync(loginDto) {
        try {
            console.info("ConexaService.loginAsync -> Chamou o endpoint de login na API.", loginDto);

            const response = await apiInstance.post("/users/validate", loginDto);

            console.info('ConexaService.loginAsync -> Resposta da API Connexa.', response);

            return response.status == STATUS_OK;
        } catch (error) {
            console.error('ConexaService.loginAsync -> Erro ao chamar o endpoint de login da API Connexa.', error);
            return false;
        }
    }

    async createUserAsync(createUserDto) {
        try {
            console.info("ConexaService.createUserAsync -> Chamou o endpoint de criar usuário na API.", createUserDto);

            const response = await apiInstance.post("/users", createUserDto);

            console.info('ConexaService.createUserAsync -> Resposta da API Connexa.', response);

            return response.status == STATUS_CREATED;
        } catch (error) {
            console.error('ConexaService.createUserAsync -> Erro ao chamar o endpoint de login da API Connexa.', error);
            return false;
        }
    }

    async getEmailAsync(email) {
        try {
            console.info("AuthenticationService.getEmailAsync -> Chamou o endpoint para buscar email na API.", email);

            const response = await apiInstance.get("/users", email);

            console.info('AuthenticationService.getEmailAsync -> Resposta da API.', response);

            if (response.status === STATUS_OK) {
                return response.data.email;
            } else {
                return null;
            }
        } catch (error) {
            console.error('AuthenticationService.getEmailAsync -> Erro ao buscar email na API.', error);
            return null;
        }
    }
    async getSecretQuestion(email) {
        try {
            const response = await apiInstance.get(`/users/secret-question?email=${email}`);

            if (response.status === 200)
                return response.data;

            throw new Error('Erro ao obter a pergunta secreta.');
        } catch (error) {
            console.error('Erro ao obter a pergunta secreta:', error);
            throw error;
        }
    }

}

export default AuthenticationService;

