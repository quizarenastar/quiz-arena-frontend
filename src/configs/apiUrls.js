const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const ApiUrl = {
    AUTH: {
        LOGIN: `${BASE_URL}/users/login`,
        SIGNUP: `${BASE_URL}/users/signup`,
        GOOGLE: `${BASE_URL}/users/google`,
        ME: `${BASE_URL}/users/me`,
        LOGOUT: `${BASE_URL}/users/logout`,
        UPDATE_PROFILE: `${BASE_URL}/users/profile`,
    },

    QUIZZES: {
        // Public quiz operations
        PUBLIC_QUIZZES: `${BASE_URL}/quizzes/public`,
        GET_QUIZ: (quizId) => `${BASE_URL}/quizzes/public/${quizId}`,

        // User quiz management (authenticated)
        MY_QUIZZES: `${BASE_URL}/quizzes/my-quizzes`,
        GET_MY_QUIZ: (quizId) => `${BASE_URL}/quizzes/${quizId}`,
        CREATE_QUIZ: `${BASE_URL}/quizzes`,
        UPDATE_QUIZ: (quizId) => `${BASE_URL}/quizzes/${quizId}`,
        DELETE_QUIZ: (quizId) => `${BASE_URL}/quizzes/${quizId}`,
        SUBMIT_QUIZ: (quizId) => `${BASE_URL}/quizzes/${quizId}/submit`,

        // Questions management
        ADD_QUESTION: (quizId) => `${BASE_URL}/quizzes/${quizId}/questions`,
        UPDATE_QUESTION: (quizId, questionId) =>
            `${BASE_URL}/quizzes/${quizId}/questions/${questionId}`,
        DELETE_QUESTION: (quizId, questionId) =>
            `${BASE_URL}/quizzes/${quizId}/questions/${questionId}`,

        // AI Integration
        GENERATE_QUESTIONS: (quizId) =>
            `${BASE_URL}/quizzes/${quizId}/generate`,
        GENERATE_QUESTIONS_PREVIEW: `${BASE_URL}/quizzes/generate-preview`,

        // Quiz attempts
        REGISTER_QUIZ: (quizId) => `${BASE_URL}/quizzes/${quizId}/register`,
        START_ATTEMPT: (quizId) => `${BASE_URL}/quizzes/${quizId}/start`,
        SUBMIT_ATTEMPT: (attemptId) =>
            `${BASE_URL}/quizzes/attempts/${attemptId}/submit`,
        MY_ATTEMPTS: `${BASE_URL}/quizzes/attempts/my-attempts`,
        ATTEMPT_DETAILS: (attemptId) =>
            `${BASE_URL}/quizzes/attempts/${attemptId}/analysis`,
        REPORT_VIOLATION: (attemptId) =>
            `${BASE_URL}/quizzes/attempts/${attemptId}/violation`,
        SUBMIT_SINGLE_ANSWER: (attemptId) =>
            `${BASE_URL}/quizzes/attempts/${attemptId}/answer`,
        CURRENT_QUESTION: (attemptId) =>
            `${BASE_URL}/quizzes/attempts/${attemptId}/current-question`,

        // Leaderboard
        LEADERBOARD: (quizId) => `${BASE_URL}/quizzes/${quizId}/leaderboard`,
        PUBLIC_LEADERBOARD: (quizId) => `${BASE_URL}/quizzes/public/${quizId}/leaderboard`,

    },

    WALLET: {
        GET_WALLET: `${BASE_URL}/wallet`,
        ADD_FUNDS: `${BASE_URL}/wallet/add-funds`,
        TRANSACTION_HISTORY: `${BASE_URL}/wallet/transactions`,
        REQUEST_WITHDRAWAL: `${BASE_URL}/wallet/withdraw`,
    },

    CONTACT: {
        SUBMIT: `${BASE_URL}/contact`,
    },
};

export default ApiUrl;
