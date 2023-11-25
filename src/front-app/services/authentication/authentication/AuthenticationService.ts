import axios, { AxiosInstance, AxiosResponse } from 'axios';
import CreateOrUpdateUserDto from './dtos/CreateOrUpdateUserDto';

const IS_PROD = false;
const STATUS_OK = 200;
const STATUS_CREATED = 201;

const apiInstance: AxiosInstance = axios.create({
  baseURL: IS_PROD ? '{{URL_PROD}}' : 'http://192.168.68.107:7151'
});

class AuthenticationService {
  async loginAsync(loginDto: { email: string; password: string }): Promise<string | null> {
    try {
      console.info("AuthenticationService.loginAsync -> Chamou o endpoint de login na API.");

      const response: AxiosResponse = await apiInstance.post("/gateway/authentication/users/validate", loginDto);

      console.info('AuthenticationService.loginAsync -> Resposta da API Connexa.', response);

      if (response.status !== STATUS_OK) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('AuthenticationService.loginAsync -> Erro ao chamar o endpoint de login da API Connexa.', error);
      return null;
    }
  }

  async createUserAsync(createUserDto: CreateOrUpdateUserDto): Promise<boolean> {
    try {
      console.info("AuthenticationService.createUserAsync -> Chamou o endpoint de criar usuário na API.", createUserDto);

      const response: AxiosResponse = await apiInstance.post("/gateway/authentication/users", createUserDto);

      console.info('AuthenticationService.createUserAsync -> Resposta da API Connexa.', response);

      return response.status === STATUS_CREATED;
    } catch (error) {
      console.error('AuthenticationService.createUserAsync -> Erro ao chamar o endpoint de login da API Connexa.', error);
      return false;
    }
  }

  async getSecretQuestionAsync(email: string): Promise<any | null> {
    try {
      console.info("AuthenticationService.getSecretQuestionAsync -> Chamou o endpoint para buscar a pergunta secreta na API.", email);

      const response: AxiosResponse = await apiInstance.get("/gateway/authentication/users/secret-question", {
        params: { email } // Configuração correta dos parâmetros de consulta
      });

      console.info('AuthenticationService.getSecretQuestionAsync -> Resposta da API.', response);

      if (response.status !== STATUS_OK) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('AuthenticationService.getSecretQuestionAsync -> Erro ao buscar a pergunta secreta na API.', error);
      return null;
    }
  }
}

export default AuthenticationService;
