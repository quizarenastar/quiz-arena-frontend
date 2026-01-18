import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Clock,
    Users,
    Trophy,
    DollarSign,
    Calendar,
    BookOpen,
    CheckCircle,
    Play,
    Edit,
} from 'lucide-react';
import toast from 'react-hot-toast';
import QuizService from '../service/QuizService';

const QuizDetails = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [userAttempt, setUserAttempt] = useState(null);

    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                setLoading(true);
                const response = await QuizService.getQuiz(quizId);

                // Merge quiz data with questions from separate array
                const quizWithQuestions = {
                    ...response.data.quiz,
                    questions:
                        response.data.questions ||
                        response.data.quiz.questions ||
                        [],
                };

                setQuiz(quizWithQuestions);

                // Check if user has already attempted this quiz
                if (response.data.userAttempt) {
                    setUserAttempt(response.data.userAttempt);
                }

                // Check if current user is the owner
                const currentUser = JSON.parse(
                    localStorage.getItem('user') || '{}',
                );
                setIsOwner(
                    response.data.quiz.creator?._id === currentUser._id ||
                        response.data.quiz.createdBy === currentUser._id,
                );
            } catch (error) {
                toast.error(error.message || 'Failed to fetch quiz details');
                console.error('Fetch Quiz Error:', error);
                navigate('/quizzes');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizDetails();
    }, [quizId, navigate]);

    const handleStartQuiz = () => {
        navigate(`/quiz/${quizId}/attempt`);
    };

    const handleEdit = () => {
        navigate(`/create-quiz?edit=${quizId}`);
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Loading quiz details...
                    </p>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-xl text-gray-600 dark:text-gray-400'>
                        Quiz not found
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
            <div className='max-w-4xl mx-auto px-4'>
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className='mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                >
                    <ArrowLeft size={20} className='mr-2' />
                    Back
                </button>

                {/* Quiz Header */}
                <div className='bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg shadow-lg p-8 mb-6 text-white dark:from-gray-500 dark:to-gray-800'>
                    <div className='flex justify-between items-start mb-4'>
                        <div className='flex-1'>
                            <h1 className='text-3xl font-bold mb-2'>
                                {quiz.title}
                            </h1>
                            <p className='text-yellow-100 mb-4'>
                                {quiz.description || 'No description provided'}
                            </p>
                        </div>
                        {isOwner && (
                            <button
                                onClick={handleEdit}
                                className='ml-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center transition-colors'
                            >
                                <Edit size={16} className='mr-2' />
                                Edit
                            </button>
                        )}
                    </div>

                    {/* Quiz Stats */}
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        <div className='flex items-center'>
                            <BookOpen size={20} className='mr-2' />
                            <div>
                                <p className='text-xs text-yellow-100'>
                                    Questions
                                </p>
                                <p className='text-lg font-semibold'>
                                    {quiz.questions?.length || 0}
                                </p>
                            </div>
                        </div>

                        <div className='flex items-center'>
                            <Clock size={20} className='mr-2' />
                            <div>
                                <p className='text-xs text-yellow-100'>
                                    Duration
                                </p>
                                <p className='text-lg font-semibold'>
                                    {Math.floor(
                                        (quiz.timeLimit || quiz.duration || 0) /
                                            60,
                                    ) > 0
                                        ? `${Math.floor((quiz.timeLimit || quiz.duration || 0) / 60)} min`
                                        : `${quiz.timeLimit || quiz.duration || 0} sec`}
                                </p>
                            </div>
                        </div>

                        <div className='flex items-center'>
                            <Users size={20} className='mr-2' />
                            <div>
                                <p className='text-xs text-yellow-100'>
                                    Attempts
                                </p>
                                <p className='text-lg font-semibold'>
                                    {quiz.attemptCount || 0}
                                </p>
                            </div>
                        </div>

                        {quiz.isPaid ? (
                            <div className='flex items-center'>
                                <DollarSign size={20} className='mr-2' />
                                <div>
                                    <p className='text-xs text-yellow-100'>
                                        Price
                                    </p>
                                    <p className='text-lg font-semibold'>
                                        ₹{quiz.price}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className='flex items-center'>
                                <Trophy size={20} className='mr-2' />
                                <div>
                                    <p className='text-xs text-yellow-100'>
                                        Type
                                    </p>
                                    <p className='text-lg font-semibold'>
                                        Free
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quiz Details */}
                <div className='bg-blue-50 dark:bg-gray-700 rounded-lg shadow-sm p-6 mb-6'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                        Quiz Information
                    </h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <p className='text-sm text-gray-600 dark:text-yellow-100 mb-1'>
                                Category
                            </p>
                            <span className='inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm'>
                                {quiz.category || 'General'}
                            </span>
                        </div>

                        <div>
                            <p className='text-sm text-gray-600 dark:text-yellow-100 mb-1'>
                                Difficulty
                            </p>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm ${
                                    quiz.difficultyLevel === 'easy' ||
                                    quiz.difficulty === 'easy'
                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                        : quiz.difficultyLevel === 'medium' ||
                                            quiz.difficulty === 'medium'
                                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                }`}
                            >
                                {quiz.difficultyLevel ||
                                    quiz.difficulty ||
                                    'Medium'}
                            </span>
                        </div>

                        {quiz.creator && (
                            <div>
                                <p className='text-sm text-gray-600 dark:text-gray-500 mb-1'>
                                    Created By
                                </p>
                                <p className='text-gray-900 dark:text-white'>
                                    {quiz.creator.name || quiz.creator.email}
                                </p>
                            </div>
                        )}

                        <div>
                            <p className='text-sm text-gray-600 dark:text-yellow-100 mb-1'>
                                Status
                            </p>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm ${
                                    quiz.status === 'approved'
                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                        : quiz.status === 'pending'
                                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                          : quiz.status === 'rejected'
                                            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                }`}
                            >
                                {quiz.status || 'Draft'}
                            </span>
                        </div>

                        {quiz.startTime && (
                            <div>
                                <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                                    <Calendar
                                        size={14}
                                        className='inline mr-1'
                                    />
                                    Start Time
                                </p>
                                <p className='text-gray-900 dark:text-white'>
                                    {new Date(quiz.startTime).toLocaleString()}
                                </p>
                            </div>
                        )}

                        {quiz.endTime && (
                            <div>
                                <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                                    <Calendar
                                        size={14}
                                        className='inline mr-1'
                                    />
                                    End Time
                                </p>
                                <p className='text-gray-900 dark:text-white'>
                                    {new Date(quiz.endTime).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quiz Settings */}
                {quiz.settings && (
                    <div className='bg-blue-50 dark:bg-gray-700 rounded-lg shadow-sm p-6 mb-6'>
                        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                            Quiz Settings
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {quiz.settings.shuffleQuestions && (
                                <div className='flex items-center'>
                                    <CheckCircle
                                        size={16}
                                        className='text-green-500 mr-2'
                                    />
                                    <span className='text-gray-700 dark:text-gray-300'>
                                        Questions Shuffled
                                    </span>
                                </div>
                            )}
                            {quiz.settings.shuffleOptions && (
                                <div className='flex items-center'>
                                    <CheckCircle
                                        size={16}
                                        className='text-green-500 mr-2'
                                    />
                                    <span className='text-gray-700 dark:text-gray-300'>
                                        Options Shuffled
                                    </span>
                                </div>
                            )}
                            {quiz.settings.showCorrectAnswers && (
                                <div className='flex items-center'>
                                    <CheckCircle
                                        size={16}
                                        className='text-green-500 mr-2'
                                    />
                                    <span className='text-gray-700 dark:text-gray-300'>
                                        Show Correct Answers
                                    </span>
                                </div>
                            )}
                            {quiz.settings.allowReview && (
                                <div className='flex items-center'>
                                    <CheckCircle
                                        size={16}
                                        className='text-green-500 mr-2'
                                    />
                                    <span className='text-gray-700 dark:text-gray-300'>
                                        Review Allowed
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Button */}
                {quiz.status === 'approved' && (
                    <div className='flex flex-col items-center gap-4'>
                        {userAttempt ? (
                            <>
                                {/* Already Attempted Message */}
                                <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center max-w-md'>
                                    <CheckCircle className='w-8 h-8 mx-auto text-green-500 mb-2' />
                                    <h3 className='text-lg font-semibold text-green-800 dark:text-green-200 mb-1'>
                                        Quiz Already Completed
                                    </h3>
                                    <p className='text-green-700 dark:text-green-300 text-sm mb-2'>
                                        You scored {userAttempt.correctAnswers}{' '}
                                        out of {userAttempt.totalQuestions}{' '}
                                        questions
                                    </p>
                                    <p className='text-green-600 dark:text-green-400 text-xs'>
                                        Completed on{' '}
                                        {new Date(
                                            userAttempt.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/quiz/${quizId}/result/${userAttempt._id}`,
                                        )
                                    }
                                    className='px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center text-lg shadow-lg transition-colors'
                                >
                                    <Trophy size={20} className='mr-2' />
                                    View Result
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleStartQuiz}
                                className='px-8 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-semibold flex items-center text-lg shadow-lg transition-colors dark:bg-gray-600 dark:hover:bg-blue-400'
                            >
                                <Play size={20} className='mr-2' />
                                Start Quiz
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizDetails;
