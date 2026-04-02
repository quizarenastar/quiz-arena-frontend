import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Clock, Target, ArrowLeft, Medal, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import QuizService from '../service/QuizService';

const Leaderboard = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const response = await QuizService.getLeaderboard(quizId);
                setData(response.data);
            } catch (error) {
                toast.error(error.message || 'Failed to load leaderboard');
                console.error('Leaderboard error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [quizId]);

    const formatTime = (seconds) => {
        if (!seconds && seconds !== 0) return '—';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const getRankStyle = (rank) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
        if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
        if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy size={20} className='text-yellow-400' />;
        if (rank === 2) return <Medal size={20} className='text-gray-400' />;
        if (rank === 3) return <Medal size={20} className='text-orange-400' />;
        return null;
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Loading leaderboard...
                    </p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <Trophy size={56} className='text-gray-400 mx-auto mb-4' />
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                        Leaderboard not available
                    </h2>
                    <p className='text-gray-500 dark:text-gray-400 mb-6'>
                        This quiz may not exist or has no participants yet.
                    </p>
                    <button
                        onClick={() => navigate('/quizzes')}
                        className='px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg'
                    >
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    const { quizTitle, totalParticipants, leaderboard } = data;

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
            <div className='max-w-3xl mx-auto px-4'>
                {/* Header */}
                <div className='mb-8'>
                    <button
                        onClick={() => navigate(-1)}
                        className='flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors'
                    >
                        <ArrowLeft size={18} className='mr-1' />
                        Back
                    </button>

                    <div className='text-center'>
                        <Trophy size={48} className='text-yellow-500 mx-auto mb-3' />
                        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-1'>
                            Leaderboard
                        </h1>
                        <p className='text-gray-600 dark:text-gray-400 text-lg'>
                            {quizTitle}
                        </p>
                        <div className='flex items-center justify-center mt-3 text-sm text-gray-500 dark:text-gray-400'>
                            <Users size={16} className='mr-1' />
                            {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>

                {/* No participants */}
                {leaderboard.length === 0 && (
                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center'>
                        <Users size={48} className='text-gray-300 dark:text-gray-600 mx-auto mb-4' />
                        <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                            No participants yet
                        </h3>
                        <p className='text-gray-500 dark:text-gray-400'>
                            The leaderboard will appear once people complete this quiz.
                        </p>
                    </div>
                )}

                {/* Top 3 Podium */}
                {leaderboard.length >= 3 && (
                    <div className='grid grid-cols-3 gap-3 mb-6'>
                        {/* 2nd Place */}
                        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center mt-6 border-t-4 border-gray-400'>
                            <div className='w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mx-auto mb-2 text-white font-bold text-lg'>
                                2
                            </div>
                            <p className='font-semibold text-gray-900 dark:text-white text-sm truncate'>
                                {leaderboard[1]?.username}
                            </p>
                            <p className='text-yellow-600 font-bold text-lg'>
                                {leaderboard[1]?.score}
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {leaderboard[1]?.percentage}%
                            </p>
                        </div>

                        {/* 1st Place */}
                        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center border-t-4 border-yellow-400'>
                            <div className='w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-2 text-white font-bold text-xl'>
                                👑
                            </div>
                            <p className='font-semibold text-gray-900 dark:text-white text-sm truncate'>
                                {leaderboard[0]?.username}
                            </p>
                            <p className='text-yellow-600 font-bold text-xl'>
                                {leaderboard[0]?.score}
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {leaderboard[0]?.percentage}%
                            </p>
                        </div>

                        {/* 3rd Place */}
                        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 text-center mt-8 border-t-4 border-orange-400'>
                            <div className='w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mx-auto mb-2 text-white font-bold text-lg'>
                                3
                            </div>
                            <p className='font-semibold text-gray-900 dark:text-white text-sm truncate'>
                                {leaderboard[2]?.username}
                            </p>
                            <p className='text-yellow-600 font-bold text-lg'>
                                {leaderboard[2]?.score}
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {leaderboard[2]?.percentage}%
                            </p>
                        </div>
                    </div>
                )}

                {/* Full Rankings Table */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
                    {/* Table Header */}
                    <div className='grid grid-cols-12 gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        <div className='col-span-1'>#</div>
                        <div className='col-span-4'>Player</div>
                        <div className='col-span-2 text-center'>Score</div>
                        <div className='col-span-2 text-center'>Accuracy</div>
                        <div className='col-span-3 text-center'>Time</div>
                    </div>

                    {/* Table Body */}
                    {leaderboard.map((entry, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-12 gap-2 px-4 py-3 items-center border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                                entry.rank <= 3 ? 'bg-yellow-50/30 dark:bg-yellow-900/5' : ''
                            }`}
                        >
                            {/* Rank */}
                            <div className='col-span-1'>
                                <span
                                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankStyle(entry.rank)}`}
                                >
                                    {entry.rank}
                                </span>
                            </div>

                            {/* Player */}
                            <div className='col-span-4 flex items-center gap-2'>
                                {getRankIcon(entry.rank)}
                                <span className='font-medium text-gray-900 dark:text-white truncate'>
                                    {entry.username}
                                </span>
                            </div>

                            {/* Score */}
                            <div className='col-span-2 text-center'>
                                <span className='font-semibold text-gray-900 dark:text-white'>
                                    {entry.score}
                                </span>
                                <span className='text-gray-400 text-xs'>
                                    /{entry.totalQuestions}
                                </span>
                            </div>

                            {/* Accuracy */}
                            <div className='col-span-2 text-center'>
                                <span
                                    className={`font-medium ${
                                        entry.percentage >= 80
                                            ? 'text-green-600'
                                            : entry.percentage >= 50
                                            ? 'text-yellow-600'
                                            : 'text-red-600'
                                    }`}
                                >
                                    {entry.percentage}%
                                </span>
                            </div>

                            {/* Time */}
                            <div className='col-span-3 text-center'>
                                <span className='text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center'>
                                    <Clock size={14} className='mr-1' />
                                    {formatTime(entry.timeTaken)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Actions */}
                <div className='flex justify-center gap-4 mt-8'>
                    <button
                        onClick={() => navigate(`/quiz/${quizId}`)}
                        className='px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors'
                    >
                        Quiz Details
                    </button>
                    <button
                        onClick={() => navigate('/quizzes')}
                        className='px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors'
                    >
                        Browse Quizzes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
