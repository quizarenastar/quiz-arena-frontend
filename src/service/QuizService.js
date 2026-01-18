import ApiUrl from '../configs/apiUrls.js';
import { makeRequest, buildUrl } from './apiClient.js';

class QuizService {
    // Public quiz operations
    async getPublicQuizzes(filters = {}) {
        const url = buildUrl(ApiUrl.QUIZZES.PUBLIC_QUIZZES, filters);
        return makeRequest(url);
    }

    async getQuiz(quizId) {
        // Try to get authenticated quiz first, fallback to public
        try {
            return await makeRequest(ApiUrl.QUIZZES.GET_MY_QUIZ(quizId));
        } catch {
            // If authenticated request fails, try public endpoint
            return makeRequest(ApiUrl.QUIZZES.GET_QUIZ(quizId));
        }
    }

    // User quiz management
    async getMyQuizzes() {
        return makeRequest(ApiUrl.QUIZZES.MY_QUIZZES);
    }

    async createQuiz(quizData) {
        return makeRequest(ApiUrl.QUIZZES.CREATE_QUIZ, {
            method: 'POST',
            body: JSON.stringify(quizData),
        });
    }

    async updateQuiz(quizId, quizData) {
        return makeRequest(ApiUrl.QUIZZES.UPDATE_QUIZ(quizId), {
            method: 'PUT',
            body: JSON.stringify(quizData),
        });
    }

    async deleteQuiz(quizId) {
        return makeRequest(ApiUrl.QUIZZES.DELETE_QUIZ(quizId), {
            method: 'DELETE',
        });
    }

    // Question management
    async addQuestion(quizId, questionData) {
        return makeRequest(ApiUrl.QUIZZES.ADD_QUESTION(quizId), {
            method: 'POST',
            body: JSON.stringify(questionData),
        });
    }

    async updateQuestion(quizId, questionId, questionData) {
        return makeRequest(ApiUrl.QUIZZES.UPDATE_QUESTION(quizId, questionId), {
            method: 'PUT',
            body: JSON.stringify(questionData),
        });
    }

    async deleteQuestion(quizId, questionId) {
        return makeRequest(ApiUrl.QUIZZES.DELETE_QUESTION(quizId, questionId), {
            method: 'DELETE',
        });
    }

    // AI Integration
    async generateQuestions(quizId, generationData) {
        return makeRequest(ApiUrl.QUIZZES.GENERATE_QUESTIONS(quizId), {
            method: 'POST',
            body: JSON.stringify(generationData),
        });
    }

    // Generate questions without creating quiz (for preview/edit)
    async generateQuestionsPreview(generationData) {
        return makeRequest(ApiUrl.QUIZZES.GENERATE_QUESTIONS_PREVIEW, {
            method: 'POST',
            body: JSON.stringify(generationData),
        });
    }

    // Quiz attempts
    async startAttempt(quizId) {
        return makeRequest(ApiUrl.QUIZZES.START_ATTEMPT(quizId), {
            method: 'POST',
        });
    }

    async submitAttempt(attemptId, attemptData) {
        return makeRequest(ApiUrl.QUIZZES.SUBMIT_ATTEMPT(attemptId), {
            method: 'POST',
            body: JSON.stringify(attemptData),
        });
    }

    async getMyAttempts(filters = {}) {
        const url = buildUrl(ApiUrl.QUIZZES.MY_ATTEMPTS, filters);
        return makeRequest(url);
    }

    async getAttemptDetails(attemptId) {
        return makeRequest(ApiUrl.QUIZZES.ATTEMPT_DETAILS(attemptId));
    }

    async reportViolation(attemptId, violationData) {
        return makeRequest(ApiUrl.QUIZZES.REPORT_VIOLATION(attemptId), {
            method: 'POST',
            body: JSON.stringify(violationData),
        });
    }

    // Leaderboard
    async getLeaderboard(quizId) {
        return makeRequest(ApiUrl.QUIZZES.LEADERBOARD(quizId));
    }
}

export default new QuizService();
