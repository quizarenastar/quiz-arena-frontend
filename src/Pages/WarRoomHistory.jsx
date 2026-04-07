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
            <div
                className='min-h-screen flex items-center justify-center'
                style={{ background: '#0f0f1a' }}
            >
                <Loader
                    size={32}
                    className='animate-spin'
                    style={{ color: '#8b5cf6' }}
                />
            </div>
        );
    }

    return (
        <div className='min-h-screen' style={{ background: '#0f0f1a' }}>
            <div className='max-w-4xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='flex items-center gap-3 mb-8'>
                    <button
                        onClick={() => navigate(-1)}
                        className='p-2 rounded-lg cursor-pointer'
                        style={{
                            background: 'rgba(30,30,50,0.6)',
                            color: '#94a3b8',
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1
                            className='text-2xl font-bold'
                            style={{ color: '#f1f5f9' }}
                        >
                            Room History
                        </h1>
                        <p className='text-sm' style={{ color: '#94a3b8' }}>
                            {history.length} rounds played
                        </p>
                    </div>
                </div>

                {history.length === 0 ? (
                    <div className='text-center py-20'>
                        <Trophy
                            size={48}
                            style={{
                                color: '#334155',
                                margin: '0 auto 16px',
                            }}
                        />
                        <p style={{ color: '#64748b' }}>
                            No quizzes played yet
                        </p>
                    </div>
                ) : (
                    <div className='space-y-3'>
                        {history.map((quiz) => (
                            <div
                                key={quiz._id}
                                className='rounded-2xl overflow-hidden'
                                style={{
                                    background: 'rgba(30,30,50,0.4)',
                                    border: '1px solid rgba(139,92,246,0.1)',
                                }}
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
                                            className='w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm'
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                                                color: '#fff',
                                            }}
                                        >
                                            #{quiz.roundNumber}
                                        </div>
                                        <div className='text-left'>
                                            <p
                                                className='font-semibold'
                                                style={{ color: '#f1f5f9' }}
                                            >
                                                {quiz.topic}
                                            </p>
                                            <div
                                                className='flex items-center gap-3 text-xs mt-0.5'
                                                style={{ color: '#64748b' }}
                                            >
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
                                                    style={{
                                                        color: '#f59e0b',
                                                    }}
                                                />
                                                <span
                                                    className='text-sm font-medium'
                                                    style={{
                                                        color: '#e2e8f0',
                                                    }}
                                                >
                                                    {quiz.results[0]
                                                        .username}
                                                </span>
                                            </div>
                                        )}
                                        {expanded === quiz._id ? (
                                            <ChevronUp
                                                size={18}
                                                style={{ color: '#64748b' }}
                                            />
                                        ) : (
                                            <ChevronDown
                                                size={18}
                                                style={{ color: '#64748b' }}
                                            />
                                        )}
                                    </div>
                                </button>

                                {/* Expanded results */}
                                {expanded === quiz._id && quiz.results && (
                                    <div
                                        className='px-5 pb-5'
                                        style={{
                                            borderTop:
                                                '1px solid rgba(139,92,246,0.08)',
                                        }}
                                    >
                                        <div className='pt-3 space-y-2'>
                                            {quiz.results.map((player) => (
                                                <div
                                                    key={player.userId}
                                                    className='flex items-center gap-3 px-3 py-2 rounded-lg'
                                                    style={{
                                                        background:
                                                            'rgba(15,15,25,0.4)',
                                                    }}
                                                >
                                                    <span
                                                        className='w-7 text-center font-bold text-sm'
                                                        style={{
                                                            color:
                                                                player.rank <=
                                                                3
                                                                    ? '#f59e0b'
                                                                    : '#64748b',
                                                        }}
                                                    >
                                                        #{player.rank}
                                                    </span>
                                                    <div
                                                        className='w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold'
                                                        style={{
                                                            background:
                                                                'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                                            color: '#fff',
                                                        }}
                                                    >
                                                        {player.username
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>
                                                    <span
                                                        className='flex-1 text-sm'
                                                        style={{
                                                            color: '#e2e8f0',
                                                        }}
                                                    >
                                                        {player.username}
                                                    </span>
                                                    <span
                                                        className='text-sm'
                                                        style={{
                                                            color: '#4ade80',
                                                        }}
                                                    >
                                                        {player.correctAnswers}{' '}
                                                        correct
                                                    </span>
                                                    <span
                                                        className='text-sm font-bold'
                                                        style={{
                                                            color: '#a78bfa',
                                                        }}
                                                    >
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
