const BASE_URL = 'https://api.quizarena.in/api/v1';

const ApiUrl = {
    AUTH: {
        LOGIN: `${BASE_URL}/users/login`,
        SIGNUP: `${BASE_URL}/users/signup`,
        GOOGLE: `${BASE_URL}/users/google`,
        ME: `${BASE_URL}/users/me`,
        LOGOUT: `${BASE_URL}/users/logout`,
    },
};

export default ApiUrl;
