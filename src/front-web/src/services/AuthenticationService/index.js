import axios from 'axios';

const IS_PROD = false;
const STATUS_OK = 200;

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
        console.info("ConexaService.createUserAsync -> Chamou o endpoint de criar usuário na API.");
        return;
    }
}

export default AuthenticationService;