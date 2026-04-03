import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Users,
    Clock,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertCircle,
    X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import QuizService from '../service/QuizService';

const MyQuizzes = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState(null);

    useEffect(() => {
        fetchMyQuizzes();
    }, []);

    const fetchMyQuizzes = async () => {
        try {
            setLoading(true);
            const response = await QuizService.getMyQuizzes();
            setQuizzes(response.data.quizzes || []);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch quizzes');
            console.error('Fetch Quizzes Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (quiz) => {
        setQuizToDelete(quiz);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!quizToDelete) return;

        try {
            await QuizService.deleteQuiz(quizToDelete._id);
            setQuizzes((prev) =>
                prev.filter((quiz) => quiz._id !== quizToDelete._id)
            );
            toast.success('Quiz deleted successfully');
            setShowDeleteModal(false);
            setQuizToDelete(null);
        } catch (error) {
            toast.error(error.message || 'Failed to delete quiz');
            console.error('Delete Quiz Error:', error);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setQuizToDelete(null);
    };

    const handleEdit = (quizId) => {
        navigate(`/create-quiz?edit=${quizId}`);
    };

    const handleView = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className='text-green-500' size={16} />;
            case 'rejected':
                return <XCircle className='text-red-500' size={16} />;
            case 'pending':
                return <AlertCircle className='text-yellow-500' size={16} />;
            default:
                return <AlertCircle className='text-gray-500' size={16} />;
        }
    };

    const getStatusText = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const filteredQuizzes = quizzes.filter((quiz) => {
        if (filter === 'all') return true;
        return quiz.status === filter;
    });

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Loading your quizzes...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
            <div className='max-w-6xl mx-auto px-4'>
                {/* Header */}
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                        My Quizzes
                    </h1>
                    <Link
                        to='/create-quiz'
                        className='px-4 py-2 bg-blue-600 hover:bg-blue-400 text-white rounded-lg font-medium flex items-center'
                    >
                        <Plus size={16} className='mr-2' />
                        Create New Quiz
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className='flex space-x-4 mb-6'>
                    {['all', 'draft', 'pending', 'approved', 'rejected'].map(
                        (status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === status
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                {status === 'all' && (
                                    <span className='ml-1 text-xs bg-gray-200 text-black dark:bg-gray-600 px-2 py-1 rounded-full'>
                                        {quizzes.length}
                                    </span>
                                )}
                            </button>
                        )
                    )}
                </div>

                {/* Quizzes Grid */}
                {filteredQuizzes.length === 0 ? (
                    <div className='text-center py-12'>
                        <div className='text-gray-400 mb-4'>
                            <svg
                                className='mx-auto h-24 w-24'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                />
                            </svg>
                        </div>
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                            {filter === 'all'
                                ? 'No quizzes found'
                                : `No ${filter} quizzes`}
                        </h3>
                        <p className='text-gray-500 dark:text-gray-400 mb-4'>
                            {filter === 'all'
                                ? 'Create your first quiz to get started'
                                : `You don't have any ${filter} quizzes yet`}
                        </p>
                        {filter === 'all' && (
                            <Link
                                to='/create-quiz'
                                className='inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium'
                            >
                                <Plus size={16} className='mr-2' />
                                Create Your First Quiz
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filteredQuizzes.map((quiz) => (
                            <div
                                key={quiz._id}
                                className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'
                            >
                                {/* Quiz Header */}
                                <div className='p-6'>
                                    <div className='flex justify-between items-start mb-4'>
                                        <div className='flex items-center space-x-2'>
                                            {getStatusIcon(quiz.status)}
                                            <span
                                                className={`text-sm font-medium ${
                                                    quiz.status === 'approved'
                                                        ? 'text-green-600'
                                                        : quiz.status ===
                                                          'rejected'
                                                        ? 'text-red-600'
                                                        : quiz.status ===
                                                          'pending'
                                                        ? 'text-yellow-600'
                                                        : 'text-gray-600'
                                                }`}
                                            >
                                                {getStatusText(quiz.status)}
                                            </span>
                                        </div>

                                        {quiz.isPaid && (
                                            <div className='flex items-center text-green-600'>
                                                <DollarSign size={14} />
                                                <span className='text-sm font-medium'>
                                                    ₹{quiz.price}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2'>
                                        {quiz.title}
                                    </h3>

                                    <p className='text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2'>
                                        {quiz.description ||
                                            'No description provided'}
                                    </p>

                                    {/* Quiz Stats */}
                                    <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4'>
                                        <div className='flex items-center'>
                                            <Users size={14} className='mr-1' />
                                            <span>
                                                {quiz.questions?.length || 0}{' '}
                                                questions
                                            </span>
                                        </div>

                                        <div className='flex items-center'>
                                            <Clock size={14} className='mr-1' />
                                            <span>{quiz.timeLimit}m</span>
                                        </div>

                                        <div className='flex items-center'>
                                            <Eye size={14} className='mr-1' />
                                            <span>
                                                {quiz.attemptCount || 0}{' '}
                                                attempts
                                            </span>
                                        </div>
                                    </div>

                                    {/* Category and Difficulty */}
                                    <div className='flex items-center justify-between mb-4'>
                                        <span className='px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full'>
                                            {quiz.category}
                                        </span>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${
                                                quiz.difficulty === 'easy'
                                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                    : quiz.difficulty ===
                                                      'medium'
                                                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                            }`}
                                        >
                                            {quiz.difficulty}
                                        </span>
                                    </div>

                                    {/* Rejection Reason */}
                                    {quiz.status === 'rejected' &&
                                        quiz.rejectionReason && (
                                            <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                                                <p className='text-sm text-red-800 dark:text-red-200'>
                                                    <span className='font-medium'>
                                                        Rejection Reason:
                                                    </span>{' '}
                                                    {quiz.rejectionReason}
                                                </p>
                                            </div>
                                        )}

                                    {/* Action Buttons */}
                                    <div className='flex space-x-2'>
                                        {/* Hide Edit if quiz has started (start time passed or has attempts) */}
                                        {!((
                                            quiz.startTime &&
                                            new Date() >= new Date(quiz.startTime)
                                        ) || (quiz.attemptCount > 0) || (quiz.analytics?.totalAttempts > 0)) && (
                                            <button
                                                onClick={() => handleEdit(quiz._id)}
                                                className='flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md text-center flex items-center justify-center'
                                            >
                                                <Edit size={14} className='mr-1' />
                                                Edit
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleView(quiz._id)}
                                            className='flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md text-center flex items-center justify-center'
                                        >
                                            <Eye size={14} className='mr-1' />
                                            View
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeleteClick(quiz)
                                            }
                                            className='px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md flex items-center justify-center'
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Quiz Footer */}
                                <div className='px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600'>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        Created{' '}
                                        {new Date(
                                            quiz.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6'>
                        {/* Modal Header */}
                        <div className='flex justify-between items-start mb-4'>
                            <div className='flex items-center'>
                                <div className='bg-red-100 dark:bg-red-900 p-3 rounded-full mr-4'>
                                    <Trash2
                                        className='text-red-600 dark:text-red-400'
                                        size={24}
                                    />
                                </div>
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                        Delete Quiz
                                    </h3>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                                        This action cannot be undone
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleDeleteCancel}
                                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className='mb-6'>
                            <p className='text-gray-700 dark:text-gray-300 mb-2'>
                                Are you sure you want to delete this quiz?
                            </p>
                            {quizToDelete && (
                                <div className='bg-gray-50 dark:bg-gray-700 p-3 rounded-lg'>
                                    <p className='font-semibold text-gray-900 dark:text-white'>
                                        {quizToDelete.title}
                                    </p>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                                        {quizToDelete.questions?.length || 0}{' '}
                                        questions •{' '}
                                        {quizToDelete.attemptCount || 0}{' '}
                                        attempts
                                    </p>
                                </div>
                            )}
                            <p className='text-sm text-red-600 dark:text-red-400 mt-3'>
                                ⚠️ All quiz data, questions, and attempt history
                                will be permanently deleted.
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div className='flex space-x-3'>
                            <button
                                onClick={handleDeleteCancel}
                                className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md font-medium transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className='flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors flex items-center justify-center'
                            >
                                <Trash2 size={16} className='mr-2' />
                                Delete Quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyQuizzes;
