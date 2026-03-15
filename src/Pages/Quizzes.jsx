import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Clock,
    Users,
    BookOpen,
    Search,
    Trophy,
    Calendar,
    Play,
    Lock,
    X,
    Medal,
    Timer,
    ChevronRight,
    CheckCircle2,
} from 'lucide-react';
import QuizService from '../service/QuizService';
import toast from 'react-hot-toast';

/* ──────────────────────────────────────────────
   Helpers
────────────────────────────────────────────── */
const now = () => new Date();

function getQuizStatus(quiz) {
    const start = quiz.startTime ? new Date(quiz.startTime) : null;
    const end = quiz.endTime ? new Date(quiz.endTime) : null;
    const n = now();
    if (!start) return 'ongoing';
    if (n < start) return 'upcoming';
    if (end && n > end) return 'ended';
    return 'ongoing';
}

function formatCountdown(targetDate) {
    const diff = new Date(targetDate) - now();
    if (diff <= 0) return '00:00:00';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (h >= 24) {
        const days = Math.floor(h / 24);
        return `${days}d ${h % 24}h`;
    }
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

function formatTime(seconds) {
    if (!seconds) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    if (s === 0) return `${m}m`;
    return `${m}m ${s}s`;
}

function formatDuration(seconds) {
    if (!seconds) return '–';
    const min = Math.floor(seconds / 60);
    return min > 0 ? `${min}m` : `${seconds}s`;
}

/* ──────────────────────────────────────────────
   Countdown hook
────────────────────────────────────────────── */
function useCountdown(targetDate) {
    const [display, setDisplay] = useState('');
    useEffect(() => {
        if (!targetDate) return;
        const tick = () => setDisplay(formatCountdown(targetDate));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return display;
}

/* ──────────────────────────────────────────────
   Leaderboard Modal
────────────────────────────────────────────── */
function LeaderboardModal({ quiz, onClose }) {
    const [loading, setLoading] = useState(true);
    const [board, setBoard] = useState([]);
    const [quizTitle, setQuizTitle] = useState(quiz.title);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await QuizService.getLeaderboard(quiz._id);
                const data = res.data;
                setBoard(data.leaderboard || []);
                setQuizTitle(data.quizTitle || quiz.title);
            } catch {
                toast.error('Failed to load leaderboard');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [quiz._id, quiz.title]);

    const rankColor = (rank) => {
        if (rank === 1) return 'text-yellow-500';
        if (rank === 2) return 'text-gray-400';
        if (rank === 3) return 'text-amber-600';
        return 'text-gray-500';
    };

    const rankBg = (rank) => {
        if (rank === 1) return 'bg-yellow-500/10 border-yellow-400/30';
        if (rank === 2) return 'bg-gray-400/10 border-gray-400/30';
        if (rank === 3) return 'bg-amber-600/10 border-amber-600/30';
        return 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700';
    };

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden'>
                {/* Header */}
                <div className='bg-gradient-to-r from-indigo-600 to-purple-600 p-5 flex items-start justify-between'>
                    <div>
                        <div className='flex items-center gap-2 mb-1'>
                            <Trophy className='w-5 h-5 text-yellow-300' />
                            <span className='text-xs font-semibold text-indigo-200 uppercase tracking-wide'>Leaderboard</span>
                        </div>
                        <h2 className='text-lg font-bold text-white line-clamp-2'>{quizTitle}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors ml-3 flex-shrink-0'
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto p-4'>
                    {loading ? (
                        <div className='flex items-center justify-center py-16'>
                            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500' />
                        </div>
                    ) : board.length === 0 ? (
                        <div className='text-center py-16 text-gray-500 dark:text-gray-400'>
                            <Trophy className='w-12 h-12 mx-auto mb-3 opacity-30' />
                            <p className='font-medium'>No attempts yet</p>
                            <p className='text-sm mt-1'>Be the first to attempt this quiz!</p>
                        </div>
                    ) : (
                        <div className='space-y-2'>
                            {board.map((entry) => (
                                <div
                                    key={entry.userId || entry.rank}
                                    className={`flex items-center gap-3 p-3 rounded-xl border ${rankBg(entry.rank)}`}
                                >
                                    {/* Rank */}
                                    <div className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded-full flex-shrink-0 ${rankColor(entry.rank)}`}>
                                        {entry.rank <= 3 ? <Medal size={18} /> : `#${entry.rank}`}
                                    </div>

                                    {/* Info */}
                                    <div className='flex-1 min-w-0'>
                                        <p className='font-semibold text-gray-900 dark:text-white truncate'>
                                            {entry.username}
                                        </p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                                            {entry.correctAnswers}/{entry.totalQuestions} correct · {entry.percentage}%
                                        </p>
                                    </div>

                                    {/* Score + time */}
                                    <div className='text-right flex-shrink-0'>
                                        <p className='font-bold text-gray-900 dark:text-white text-sm'>{entry.score} pts</p>
                                        <p className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-end'>
                                            <Timer size={11} />{formatTime(entry.timeTaken)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='border-t border-gray-200 dark:border-gray-700 p-3 text-center'>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Ranked by score · ties broken by completion time
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   QuizCard
────────────────────────────────────────────── */
function QuizCard({ quiz, status, getDifficultyColor, onLeaderboard, isRegistered }) {
    const startCountdown = useCountdown(status === 'upcoming' ? quiz.startTime : null);
    const endCountdown = useCountdown(status === 'ongoing' ? quiz.endTime : null);

    const difficultyLabel =
        (quiz.difficulty || quiz.difficultyLevel || 'medium');

    const durationSec = quiz.duration || quiz.timeLimit || 30;

    return (
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 border border-gray-100 dark:border-gray-700'>
            {/* Top accent bar */}
            <div className={`h-1 w-full ${status === 'ongoing' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : status === 'upcoming' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`} />

            <div className='p-5 flex flex-col flex-grow gap-3'>
                {/* Badges row */}
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'>
                        {quiz.category || 'General'}
                    </span>
                    {quiz.price > 0 ? (
                        <span className='px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'>
                            ₹{quiz.price}
                        </span>
                    ) : (
                        <span className='px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'>
                            Free
                        </span>
                    )}
                    <span className={`text-xs font-medium ml-auto ${getDifficultyColor(difficultyLabel)}`}>
                        {difficultyLabel.charAt(0).toUpperCase() + difficultyLabel.slice(1)}
                    </span>
                </div>

                {/* Title + description */}
                <div>
                    <h3 className='text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug'>
                        {quiz.title}
                    </h3>
                    {quiz.description && (
                        <p className='text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-2'>
                            {quiz.description}
                        </p>
                    )}
                </div>

                {/* Stats row */}
                <div className='grid grid-cols-3 gap-2'>
                    <div className='flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400'>
                        <Clock className='w-4 h-4 mb-0.5' />
                        <span>{formatDuration(durationSec)}</span>
                    </div>
                    <div className='flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400'>
                        <BookOpen className='w-4 h-4 mb-0.5' />
                        <span>{quiz.totalQuestions || '?'}Q</span>
                    </div>
                    <div className='flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400'>
                        <Users className='w-4 h-4 mb-0.5' />
                        <span>{quiz.analytics?.totalAttempts || 0}</span>
                    </div>
                </div>

                {/* Timing info */}
                {status === 'ongoing' && quiz.endTime && (
                    <div className='flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-1.5'>
                        <Timer size={13} />
                        <span>Ends in <span className='font-mono font-semibold'>{endCountdown}</span></span>
                    </div>
                )}
                {status === 'upcoming' && quiz.startTime && (
                    <div className='flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-1.5'>
                        <Calendar size={13} />
                        <span>Starts in <span className='font-mono font-semibold'>{startCountdown}</span></span>
                    </div>
                )}
                {status === 'ended' && quiz.endTime && (
                    <div className='flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-1.5'>
                        <Clock size={13} />
                        <span>Ended {new Date(quiz.endTime).toLocaleDateString()}</span>
                    </div>
                )}

                {/* CTA */}
                <div className='mt-auto pt-1'>
                    {status === 'ongoing' && (
                        <Link
                            to={`/quiz/${quiz._id}`}
                            className='flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-sm transition-all shadow-sm'
                        >
                            <Play size={15} />
                            Start Quiz
                        </Link>
                    )}
                    {status === 'upcoming' && (
                        quiz.isPaid ? (
                            isRegistered ? (
                                <div className='flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm'>
                                    <CheckCircle2 size={15} />
                                    Registered
                                </div>
                            ) : (
                                <Link
                                    to={`/quiz/${quiz._id}`}
                                    className='flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm transition-all shadow-sm'
                                >
                                    <Lock size={15} />
                                    Register Now
                                </Link>
                            )
                        ) : (
                            <button
                                disabled
                                className='flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold text-sm cursor-not-allowed'
                            >
                                <Calendar size={15} />
                                Coming Soon
                            </button>
                        )
                    )}
                    {status === 'ended' && (
                        <button
                            onClick={() => onLeaderboard(quiz)}
                            className='flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-sm transition-all shadow-sm'
                        >
                            <Trophy size={15} />
                            View Leaderboard
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────
   Tab Button
────────────────────────────────────────────── */
function TabBtn({ label, count, active, onClick, color }) {
    const colors = {
        green: active ? 'bg-green-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20',
        blue: active ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20',
        gray: active ? 'bg-gray-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
    };
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${colors[color]}`}
        >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? 'bg-white/25 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {count}
            </span>
        </button>
    );
}

/* ──────────────────────────────────────────────
   Main Component
────────────────────────────────────────────── */
function Quizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ongoing');
    const [leaderboardQuiz, setLeaderboardQuiz] = useState(null);
    const [filters, setFilters] = useState({ category: '', difficulty: '', search: '' });

    const fetchQuizzes = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.category) params.category = filters.category;
            if (filters.difficulty) params.difficulty = filters.difficulty;
            if (filters.search) params.search = filters.search;
            const response = await QuizService.getPublicQuizzes(params);
            setQuizzes(response.data.quizzes || []);
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            toast.error('Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { fetchQuizzes(); }, [fetchQuizzes]);

    const handleFilterChange = (name, value) => setFilters((p) => ({ ...p, [name]: value }));

    const getDifficultyColor = (d) => {
        switch (d?.toLowerCase()) {
            case 'easy': return 'text-green-600 dark:text-green-400';
            case 'medium': return 'text-yellow-600 dark:text-yellow-400';
            case 'hard': return 'text-red-600 dark:text-red-400';
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };

    // Split quizzes into 3 buckets
    const ongoing = quizzes.filter((q) => getQuizStatus(q) === 'ongoing');
    const upcoming = quizzes.filter((q) => getQuizStatus(q) === 'upcoming');
    const ended = quizzes.filter((q) => getQuizStatus(q) === 'ended');

    const tabData = { ongoing, upcoming, ended };
    const currentList = tabData[activeTab] || [];

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-14 w-14 border-b-2 border-blue-500 mx-auto' />
                    <p className='mt-4 text-gray-500 dark:text-gray-400 text-sm'>Loading quizzes…</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                {/* Header */}
                <div className='mb-6'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                        Quiz <span className='text-blue-500'>Arena</span>
                    </h1>
                    <p className='text-gray-500 dark:text-gray-400 mt-1 text-sm'>
                        Browse, compete, and top the leaderboard
                    </p>
                </div>

                {/* Filters row */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6 flex flex-col sm:flex-row gap-3'>
                    {/* Search */}
                    <div className='relative flex-1 min-w-0'>
                        <Search className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search quizzes…'
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && fetchQuizzes()}
                            className='w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                        />
                    </div>

                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className='px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none'
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
                        <option value='general-knowledge'>General Knowledge</option>
                    </select>

                    <select
                        value={filters.difficulty}
                        onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                        className='px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none'
                    >
                        <option value=''>All Difficulties</option>
                        <option value='easy'>Easy</option>
                        <option value='medium'>Medium</option>
                        <option value='hard'>Hard</option>
                    </select>

                    <button
                        onClick={fetchQuizzes}
                        className='px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors'
                    >
                        Search
                    </button>
                </div>

                {/* Tabs */}
                <div className='flex items-center gap-2 mb-6 bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-700 w-fit'>
                    <TabBtn label='🟢 Ongoing' count={ongoing.length} active={activeTab === 'ongoing'} onClick={() => setActiveTab('ongoing')} color='green' />
                    <TabBtn label='🔵 Upcoming' count={upcoming.length} active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')} color='blue' />
                    <TabBtn label='⚫ Ended' count={ended.length} active={activeTab === 'ended'} onClick={() => setActiveTab('ended')} color='gray' />
                </div>

                {/* Grid */}
                {currentList.length === 0 ? (
                    <div className='text-center py-20'>
                        <BookOpen className='w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
                        <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300'>
                            No {activeTab} quizzes
                        </h3>
                        <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>
                            {activeTab === 'ongoing' && 'Check back soon or explore upcoming quizzes.'}
                            {activeTab === 'upcoming' && 'No quizzes scheduled yet. Register for notifications!'}
                            {activeTab === 'ended' && 'No quizzes have ended yet.'}
                        </p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {currentList.map((quiz) => (
                            <QuizCard
                                key={quiz._id}
                                quiz={quiz}
                                status={activeTab}
                                getDifficultyColor={getDifficultyColor}
                                onLeaderboard={setLeaderboardQuiz}
                                isRegistered={quiz.isRegistered || false}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Leaderboard Modal */}
            {leaderboardQuiz && (
                <LeaderboardModal
                    quiz={leaderboardQuiz}
                    onClose={() => setLeaderboardQuiz(null)}
                />
            )}
        </div>
    );
}

export default Quizzes;
