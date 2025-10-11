import ApiUrl from '../configs/apiUrls.js';

class QuizService {
    // Helper method for API calls
    async makeRequest(url, options = {}) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers,
            };

            const response = await fetch(url, {
                ...options,
                headers,
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Public quiz operations
    async getPublicQuizzes(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams
            ? `${ApiUrl.QUIZZES.PUBLIC_QUIZZES}?${queryParams}`
            : ApiUrl.QUIZZES.PUBLIC_QUIZZES;
        return this.makeRequest(url);
    }

    async getQuiz(quizId) {
        // Try to get authenticated quiz first, fallback to public
        try {
            return await this.makeRequest(ApiUrl.QUIZZES.GET_MY_QUIZ(quizId));
        } catch {
            // If authenticated request fails, try public endpoint
            return this.makeRequest(ApiUrl.QUIZZES.GET_QUIZ(quizId));
        }
    }

    // User quiz management
    async getMyQuizzes() {
        return this.makeRequest(ApiUrl.QUIZZES.MY_QUIZZES);
    }

    async createQuiz(quizData) {
        return this.makeRequest(ApiUrl.QUIZZES.CREATE_QUIZ, {
            method: 'POST',
            body: JSON.stringify(quizData),
        });
    }

    async updateQuiz(quizId, quizData) {
        return this.makeRequest(ApiUrl.QUIZZES.UPDATE_QUIZ(quizId), {
            method: 'PUT',
            body: JSON.stringify(quizData),
        });
    }

    async deleteQuiz(quizId) {
        return this.makeRequest(ApiUrl.QUIZZES.DELETE_QUIZ(quizId), {
            method: 'DELETE',
        });
    }

    // Question management
    async addQuestion(quizId, questionData) {
        return this.makeRequest(ApiUrl.QUIZZES.ADD_QUESTION(quizId), {
            method: 'POST',
            body: JSON.stringify(questionData),
        });
    }

    async updateQuestion(quizId, questionId, questionData) {
        return this.makeRequest(
            ApiUrl.QUIZZES.UPDATE_QUESTION(quizId, questionId),
            {
                method: 'PUT',
                body: JSON.stringify(questionData),
            }
        );
    }

    async deleteQuestion(quizId, questionId) {
        return this.makeRequest(
            ApiUrl.QUIZZES.DELETE_QUESTION(quizId, questionId),
            {
                method: 'DELETE',
            }
        );
    }

    // AI Integration
    async generateQuestions(quizId, generationData) {
        return this.makeRequest(ApiUrl.QUIZZES.GENERATE_QUESTIONS(quizId), {
            method: 'POST',
            body: JSON.stringify(generationData),
        });
    }

    // Generate questions without creating quiz (for preview/edit)
    async generateQuestionsPreview(generationData) {
        return this.makeRequest(ApiUrl.QUIZZES.GENERATE_QUESTIONS_PREVIEW, {
            method: 'POST',
            body: JSON.stringify(generationData),
        });
    }

    // Quiz attempts
    async startAttempt(quizId) {
        return this.makeRequest(ApiUrl.QUIZZES.START_ATTEMPT(quizId), {
            method: 'POST',
        });
    }

    async submitAttempt(attemptId, attemptData) {
        return this.makeRequest(ApiUrl.QUIZZES.SUBMIT_ATTEMPT(attemptId), {
            method: 'POST',
            body: JSON.stringify(attemptData),
        });
    }

    async getMyAttempts() {
        return this.makeRequest(ApiUrl.QUIZZES.MY_ATTEMPTS);
    }

    async getAttemptDetails(attemptId) {
        return this.makeRequest(ApiUrl.QUIZZES.ATTEMPT_DETAILS(attemptId));
    }

    async reportViolation(attemptId, violationData) {
        return this.makeRequest(ApiUrl.QUIZZES.REPORT_VIOLATION(attemptId), {
            method: 'POST',
            body: JSON.stringify(violationData),
        });
    }

    // Leaderboard
    async getLeaderboard(quizId) {
        return this.makeRequest(ApiUrl.QUIZZES.LEADERBOARD(quizId));
    }
}

export default new QuizService();
