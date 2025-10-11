import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, BookOpen, Search } from 'lucide-react';
import QuizService from '../service/QuizService';
import toast from 'react-hot-toast';

function QuizCard({ quiz, getDifficultyColor }) {
    return (
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 flex flex-col h-full'>
            <div className='relative'>
                <span
                    className={`
                    absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-800/90
                    ${getDifficultyColor(quiz.difficulty)}`}
                >
                    {quiz.difficulty?.charAt(0).toUpperCase() +
                        quiz.difficulty?.slice(1) || 'Medium'}
                </span>

                {quiz.isPaid && quiz.price > 0 && (
                    <span className='absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white'>
                        ₹{quiz.price}
                    </span>
                )}
            </div>

            <div className='p-4 sm:p-5 flex flex-col flex-grow'>
                <div className='mb-2'>
                    <span className='inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'>
                        {quiz.category || 'General'}
                    </span>
                </div>

                <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2'>
                    {quiz.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow'>
                    {quiz.description || 'No description available'}
                </p>

                <div className='grid grid-cols-3 gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4'>
                    <div className='flex items-center gap-1 justify-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
                        <Clock className='w-4 h-4' />
                        <span>{quiz.duration || quiz.timeLimit || 30}m</span>
                    </div>
                    <div className='flex items-center gap-1 justify-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
                        <BookOpen className='w-4 h-4' />
                        <span>
                            {quiz.totalQuestions || quiz.questionCount || 0}Q
                        </span>
                    </div>
                    <div className='flex items-center gap-1 justify-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
                        <Users className='w-4 h-4' />
                        <span>{quiz.analytics?.totalAttempts || 0}</span>
                    </div>
                </div>

                <Link
                    to={`/quiz/${quiz._id}`}
                    className='block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm sm:text-base'
                >
                    Start Quiz
                </Link>
            </div>
        </div>
    );
}

function Quizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        difficulty: '',
        search: '',
    });

    const fetchQuizzes = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = {};

            if (filters.category) queryParams.category = filters.category;
            if (filters.difficulty) queryParams.difficulty = filters.difficulty;
            if (filters.search) queryParams.search = filters.search;

            const response = await QuizService.getPublicQuizzes(queryParams);
            setQuizzes(response.data.quizzes || []);
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            toast.error('Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);
    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({ ...prev, [filterName]: value }));
    };

    const handleApplyFilters = () => {
        fetchQuizzes();
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
                return 'text-green-600';
            case 'medium':
                return 'text-yellow-600';
            case 'hard':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Loading quizzes...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
                    <div>
                        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white'>
                            Available Quizzes
                        </h1>
                        <p className='text-gray-600 dark:text-gray-400 mt-1'>
                            {quizzes.length}{' '}
                            {quizzes.length === 1 ? 'quiz' : 'quizzes'}{' '}
                            available
                        </p>
                    </div>

                    <div className='flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4'>
                        {/* Search */}
                        <div className='relative'>
                            <input
                                type='text'
                                placeholder='Search quizzes...'
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange('search', e.target.value)
                                }
                                onKeyPress={(e) =>
                                    e.key === 'Enter' && handleApplyFilters()
                                }
                                className='w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                            <Search className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={filters.category}
                            onChange={(e) =>
                                handleFilterChange('category', e.target.value)
                            }
                            className='w-full sm:w-40 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                            <option value=''>All Categories</option>
                            <option value='technology'>Technology</option>
                            <option value='science'>Science</option>
                            <option value='history'>History</option>
                            <option value='geography'>Geography</option>
                            <option value='sports'>Sports</option>
                            <option value='entertainment'>Entertainment</option>
                            <option value='literature'>Literature</option>
                            <option value='mathematics'>Mathematics</option>
                            <option value='general-knowledge'>
                                General Knowledge
                            </option>
                        </select>

                        {/* Difficulty Filter */}
                        <select
                            value={filters.difficulty}
                            onChange={(e) =>
                                handleFilterChange('difficulty', e.target.value)
                            }
                            className='w-full sm:w-40 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                            <option value=''>All Difficulties</option>
                            <option value='easy'>Easy</option>
                            <option value='medium'>Medium</option>
                            <option value='hard'>Hard</option>
                        </select>

                        {/* Apply Filters Button */}
                        <button
                            onClick={handleApplyFilters}
                            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors'
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {quizzes.length === 0 ? (
                    <div className='text-center py-16'>
                        <BookOpen className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                            No quizzes found
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400'>
                            Try adjusting your filters or check back later
                        </p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                        {quizzes.map((quiz) => (
                            <QuizCard
                                key={quiz._id}
                                quiz={quiz}
                                getDifficultyColor={getDifficultyColor}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Quizzes;
