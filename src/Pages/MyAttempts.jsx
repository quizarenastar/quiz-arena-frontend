import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Clock,
    Trophy,
    Target,
    Calendar,
    ChevronRight,
    BookOpen,
    AlertCircle,
} from 'lucide-react';
import QuizService from '../service/QuizService';
import toast from 'react-hot-toast';

const MyAttempts = () => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        total: 1,
        hasNext: false,
        hasPrev: false,
    });

    const fetchAttempts = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const response = await QuizService.getMyAttempts({
                page,
                limit: 10,
            });
            setAttempts(response.data.attempts || []);
            setPagination(
                response.data.pagination || {
                    current: 1,
                    total: 1,
                    hasNext: false,
                    hasPrev: false,
                },
            );
        } catch (error) {
            console.error('Failed to fetch attempts:', error);
            toast.error('Failed to load your quiz attempts');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAttempts();
    }, [fetchAttempts]);

    const getScoreColor = (correct, total) => {
        const percentage = (correct / total) * 100;
        if (percentage >= 80)
            return 'text-green-600 bg-green-100 dark:bg-green-900/30';
        if (percentage >= 60)
            return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            completed:
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'auto-submitted':
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            abandoned:
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            'in-progress':
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        };
        return (
            statusStyles[status] ||
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        );
    };

    const formatDuration = (ms) => {
        if (!ms) return '0:00';
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Loading your attempts...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-12'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-2xl sm:text-3xl font-bold text-blue-500 dark:text-white'>
                        My Quiz Attempts
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400 mt-1'>
                        {attempts.length} total attempts
                    </p>
                </div>

                {attempts.length === 0 ? (
                    <div className='text-center py-16'>
                        <BookOpen className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                            No attempts yet
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400 mb-6'>
                            You haven't attempted any quizzes yet. Start
                            exploring!
                        </p>
                        <Link
                            to='/quizzes'
                            className='inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors'
                        >
                            Browse Quizzes
                            <ChevronRight size={20} className='ml-2' />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Attempts List */}
                        <div className='space-y-4'>
                            {attempts.map((attempt) => (
                                <div
                                    key={attempt._id}
                                    className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow'
                                >
                                    <div className='p-4 sm:p-6'>
                                        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                                            {/* Quiz Info */}
                                            <div className='flex-1'>
                                                <div className='flex items-start gap-3'>
                                                    <div
                                                        className={`p-3 rounded-lg ${getScoreColor(attempt.correctAnswers, attempt.totalQuestions)}`}
                                                    >
                                                        <Trophy size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                                            {attempt.quizId
                                                                ?.title ||
                                                                'Quiz'}
                                                        </h3>
                                                        <div className='flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400'>
                                                            <span className='flex items-center gap-1'>
                                                                <Target
                                                                    size={14}
                                                                />
                                                                {attempt.quizId
                                                                    ?.topic ||
                                                                    'General'}
                                                            </span>
                                                            <span className='flex items-center gap-1'>
                                                                <Calendar
                                                                    size={14}
                                                                />
                                                                {new Date(
                                                                    attempt.createdAt,
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Score & Stats */}
                                            <div className='flex items-center gap-4'>
                                                {/* Score */}
                                                <div className='text-center'>
                                                    <div
                                                        className={`text-2xl font-bold ${
                                                            attempt.correctAnswers /
                                                                attempt.totalQuestions >=
                                                            0.8
                                                                ? 'text-green-600'
                                                                : attempt.correctAnswers /
                                                                        attempt.totalQuestions >=
                                                                    0.6
                                                                  ? 'text-yellow-600'
                                                                  : 'text-red-600'
                                                        }`}
                                                    >
                                                        {attempt.correctAnswers}
                                                        /
                                                        {attempt.totalQuestions}
                                                    </div>
                                                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                                                        Score
                                                    </div>
                                                </div>

                                                {/* Duration */}
                                                <div className='text-center'>
                                                    <div className='flex items-center gap-1 text-gray-700 dark:text-gray-300'>
                                                        <Clock size={16} />
                                                        {formatDuration(
                                                            attempt.duration,
                                                        )}
                                                    </div>
                                                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                                                        Time
                                                    </div>
                                                </div>

                                                {/* Status */}
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(attempt.status)}`}
                                                >
                                                    {attempt.status ===
                                                    'auto-submitted'
                                                        ? 'Auto Submit'
                                                        : attempt.status ===
                                                            'in-progress'
                                                          ? 'In Progress'
                                                          : attempt.status
                                                                ?.charAt(0)
                                                                .toUpperCase() +
                                                            attempt.status?.slice(
                                                                1,
                                                            )}
                                                </span>

                                                {/* Action Button based on status */}
                                                {attempt.status ===
                                                'in-progress' ? (
                                                    <Link
                                                        to={`/quiz/${attempt.quizId?._id}/attempt`}
                                                        className='px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-1'
                                                    >
                                                        Resume
                                                        <ChevronRight
                                                            size={16}
                                                        />
                                                    </Link>
                                                ) : attempt.status ===
                                                      'completed' ||
                                                  attempt.status ===
                                                      'auto-submitted' ? (
                                                    <Link
                                                        to={`/quiz/${attempt.quizId?._id}/result/${attempt._id}`}
                                                        className='p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'
                                                    >
                                                        <ChevronRight
                                                            size={20}
                                                        />
                                                    </Link>
                                                ) : (
                                                    <span className='p-2 text-gray-400'>
                                                        <ChevronRight
                                                            size={20}
                                                        />
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Violations Warning */}
                                        {attempt.antiCheatViolations?.length >
                                            0 && (
                                            <div className='mt-3 flex items-center gap-2 text-yellow-600 dark:text-yellow-400 text-sm'>
                                                <AlertCircle size={14} />
                                                {
                                                    attempt.antiCheatViolations
                                                        .length
                                                }{' '}
                                                violation(s) recorded
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {(pagination.hasNext || pagination.hasPrev) && (
                            <div className='flex justify-center gap-4 mt-8'>
                                <button
                                    onClick={() =>
                                        fetchAttempts(pagination.current - 1)
                                    }
                                    disabled={!pagination.hasPrev}
                                    className='px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                >
                                    Previous
                                </button>
                                <span className='px-4 py-2 text-gray-600 dark:text-gray-400'>
                                    Page {pagination.current} of{' '}
                                    {pagination.total}
                                </span>
                                <button
                                    onClick={() =>
                                        fetchAttempts(pagination.current + 1)
                                    }
                                    disabled={!pagination.hasNext}
                                    className='px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyAttempts;
