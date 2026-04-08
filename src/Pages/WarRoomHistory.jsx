import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Trophy,
    Calendar,
    Users,
    ChevronDown,
    ChevronUp,
    Loader,
} from 'lucide-react';
import WarRoomService from '../service/WarRoomService';
import toast from 'react-hot-toast';

export default function WarRoomHistory() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        loadHistory();
    }, [roomId]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const res = await WarRoomService.getRoomHistory(roomId);
            setHistory(res.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <Loader size={32} className='animate-spin text-violet-500' />
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='max-w-4xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='flex items-center gap-3 mb-8'>
                    <button
                        onClick={() => navigate(-1)}
                        className='p-2 rounded-lg cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                            Room History
                        </h1>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {history.length} rounds played
                        </p>
                    </div>
                </div>

                {history.length === 0 ? (
                    <div className='text-center py-20'>
                        <Trophy size={48} className='text-gray-300 dark:text-gray-600 mx-auto mb-4' />
                        <p className='text-gray-500 dark:text-gray-400'>
                            No quizzes played yet
                        </p>
                    </div>
                ) : (
                    <div className='space-y-3'>
                        {history.map((quiz) => (
                            <div
                                key={quiz._id}
                                className='rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                            >
                                {/* Round header */}
                                <button
                                    onClick={() =>
                                        setExpanded(
                                            expanded === quiz._id
                                                ? null
                                                : quiz._id
                                        )
                                    }
                                    className='w-full flex items-center justify-between p-5 cursor-pointer'
                                >
                                    <div className='flex items-center gap-4'>
                                        <div
                                            className='w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                                        >
                                            #{quiz.roundNumber}
                                        </div>
                                        <div className='text-left'>
                                            <p className='font-semibold text-gray-900 dark:text-white'>
                                                {quiz.topic}
                                            </p>
                                            <div className='flex items-center gap-3 text-xs mt-0.5 text-gray-500 dark:text-gray-400'>
                                                <span className='flex items-center gap-1'>
                                                    <Calendar size={12} />
                                                    {new Date(
                                                        quiz.startedAt
                                                    ).toLocaleDateString()}
                                                </span>
                                                <span>
                                                    {quiz.difficulty}
                                                </span>
                                                <span>
                                                    {quiz.totalQuestions} Q
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <Users size={12} />
                                                    {quiz.results?.length || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        {quiz.results?.[0] && (
                                            <div className='flex items-center gap-2'>
                                                <Trophy
                                                    size={14}
                                                    className='text-amber-500'
                                                />
                                                <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                                                    {quiz.results[0]
                                                        .username}
                                                </span>
                                            </div>
                                        )}
                                        {expanded === quiz._id ? (
                                            <ChevronUp
                                                size={18}
                                                className='text-gray-500 dark:text-gray-400'
                                            />
                                        ) : (
                                            <ChevronDown
                                                size={18}
                                                className='text-gray-500 dark:text-gray-400'
                                            />
                                        )}
                                    </div>
                                </button>

                                {/* Expanded results */}
                                {expanded === quiz._id && quiz.results && (
                                    <div className='px-5 pb-5 border-t border-gray-200 dark:border-gray-700'>
                                        <div className='pt-3 space-y-2'>
                                            {quiz.results.map((player) => (
                                                <div
                                                    key={player.userId}
                                                    className='flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700/40'
                                                >
                                                    <span
                                                        className={`w-7 text-center font-bold text-sm ${
                                                            player.rank <= 3
                                                                ? 'text-amber-500'
                                                                : 'text-gray-500 dark:text-gray-400'
                                                        }`}
                                                    >
                                                        #{player.rank}
                                                    </span>
                                                    <div className='w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-white'>
                                                        {player.username
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>
                                                    <span className='flex-1 text-sm text-gray-700 dark:text-gray-200'>
                                                        {player.username}
                                                    </span>
                                                    <span className='text-sm text-green-600 dark:text-green-400'>
                                                        {player.correctAnswers}{' '}
                                                        correct
                                                    </span>
                                                    <span className='text-sm font-bold text-violet-600 dark:text-violet-300'>
                                                        {player.score} pts
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
