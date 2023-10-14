import axios from 'axios';

const IS_PROD = false;

const apiInstance = axios.create({
    baseURL: IS_PROD ? '{{URL_PROD}}' : 'https://localhost:7100/'
});

class ConexaService {
    // loginAsync = async (loginDto) => {

    // };

    async loginAsync(loginDto) {

    }

    async createUserAsync(createUserDto) {

    }
}

export default ConexaService;