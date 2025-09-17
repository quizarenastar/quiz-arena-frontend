const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const ApiUrl = {
    AUTH: {
        LOGIN: `${BASE_URL}/users/login`,
        SIGNUP: `${BASE_URL}/users/signup`,
        GOOGLE: `${BASE_URL}/users/google`,
        ME: `${BASE_URL}/users/me`,
        LOGOUT: `${BASE_URL}/users/logout`,
    },

    CONTACT: {
        SUBMIT: `${BASE_URL}/contact`,
    },
};

export default ApiUrl;
