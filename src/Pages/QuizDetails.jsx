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
    Zap,
    BarChart3,
    Shield,
    Tag,
    User,
    ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import QuizService from '../service/QuizService';
import QuizRegistration from '../Components/QuizRegistration';

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

                const quizWithQuestions = {
                    ...response.data.quiz,
                    questions:
                        response.data.questions ||
                        response.data.quiz.questions ||
                        [],
                };

                setQuiz(quizWithQuestions);

                if (response.data.userAttempt) {
                    setUserAttempt(response.data.userAttempt);
                }

                const currentUser = JSON.parse(
                    localStorage.getItem('user') || '{}',
                );
                setIsOwner(
                    String(response.data.quiz.creatorId?._id) === String(currentUser._id) ||
                        String(response.data.quiz.creatorId) === String(currentUser._id),
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

    const handleStartQuiz = async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.warn('Fullscreen request failed:', err);
        }
        navigate(`/quiz/${quizId}/attempt`);
    };

    const handleEdit = () => {
        navigate(`/create-quiz?edit=${quizId}`);
    };

    const getDifficultyConfig = (diff) => {
        const d = diff?.toLowerCase() || 'medium';
        if (d === 'easy')
            return {
                label: 'Easy',
                color: 'text-emerald-600 dark:text-emerald-400',
                bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                border: 'border-emerald-200 dark:border-emerald-500/20',
                dot: 'bg-emerald-500 dark:bg-emerald-400',
            };
        if (d === 'hard')
            return {
                label: 'Hard',
                color: 'text-red-600 dark:text-red-400',
                bg: 'bg-red-50 dark:bg-red-500/10',
                border: 'border-red-200 dark:border-red-500/20',
                dot: 'bg-red-500 dark:bg-red-400',
            };
        return {
            label: 'Medium',
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-500/10',
            border: 'border-amber-200 dark:border-amber-500/20',
            dot: 'bg-amber-500 dark:bg-amber-400',
        };
    };

    const getStatusConfig = (status) => {
        const s = status?.toLowerCase() || 'draft';
        if (s === 'approved')
            return {
                label: 'Approved',
                color: 'text-emerald-700 dark:text-emerald-400',
                bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                border: 'border-emerald-200 dark:border-emerald-500/30',
            };
        if (s === 'pending')
            return {
                label: 'Pending Review',
                color: 'text-amber-700 dark:text-amber-400',
                bg: 'bg-amber-50 dark:bg-amber-500/10',
                border: 'border-amber-200 dark:border-amber-500/30',
            };
        if (s === 'rejected')
            return {
                label: 'Rejected',
                color: 'text-red-700 dark:text-red-400',
                bg: 'bg-red-50 dark:bg-red-500/10',
                border: 'border-red-200 dark:border-red-500/30',
            };
        return {
            label: 'Draft',
            color: 'text-gray-600 dark:text-gray-400',
            bg: 'bg-gray-100 dark:bg-gray-500/10',
            border: 'border-gray-200 dark:border-gray-500/30',
        };
    };

    const formatDuration = (dur) => {
        const d = dur || 0;
        if (d >= 60)
            return `${Math.floor(d / 60)}m ${d % 60 ? (d % 60) + 's' : ''}`.trim();
        return `${d}s`;
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center'>
                <div className='text-center'>
                    <div className='relative w-16 h-16 mx-auto mb-4'>
                        <div className='absolute inset-0 rounded-full border-2 border-violet-200 dark:border-violet-500/20'></div>
                        <div className='absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin'></div>
                    </div>
                    <p className='text-gray-500 dark:text-gray-500 text-sm'>
                        Loading quiz...
                    </p>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-xl text-gray-500 dark:text-gray-400 mb-4'>
                        Quiz not found
                    </p>
                    <button
                        onClick={() => navigate('/quizzes')}
                        className='px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition-colors'
                    >
                        Back to Quizzes
                    </button>
                </div>
            </div>
        );
    }

    const diffConfig = getDifficultyConfig(
        quiz.difficulty || quiz.difficultyLevel,
    );
    const statusConfig = getStatusConfig(quiz.status);
    const duration = quiz.timeLimit || quiz.duration || 0;

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white'>
            {/* Ambient background glow (dark mode only) */}
            <div className='fixed inset-0 pointer-events-none hidden dark:block'>
                <div className='absolute top-0 left-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-[128px]'></div>
                <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/6 rounded-full blur-[128px]'></div>
            </div>

            <div className='relative max-w-3xl mx-auto px-4 py-6'>
                {/* Top Bar */}
                <div className='flex items-center justify-between mb-8'>
                    <button
                        onClick={() => navigate(-1)}
                        className='flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group'
                    >
                        <ArrowLeft
                            size={18}
                            className='group-hover:-translate-x-0.5 transition-transform'
                        />
                        <span className='text-sm'>Back</span>
                    </button>

                    <div className='flex items-center gap-2'>
                        {/* Status badge */}
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                        >
                            {statusConfig.label}
                        </span>

                        {isOwner && !(
                            (quiz.startTime && new Date() >= new Date(quiz.startTime)) ||
                            (quiz.attemptCount > 0) ||
                            (quiz.analytics?.totalAttempts > 0)
                        ) && (
                            <button
                                onClick={handleEdit}
                                className='flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all'
                            >
                                <Edit size={14} />
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Hero Section */}
                <div className='mb-8'>
                    {/* Tags row */}
                    <div className='flex flex-wrap items-center gap-2 mb-4'>
                        {quiz.category && (
                            <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-lg text-xs text-violet-700 dark:text-violet-300'>
                                <Tag size={12} />
                                {quiz.category}
                            </span>
                        )}
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${diffConfig.bg} border ${diffConfig.border} rounded-lg text-xs ${diffConfig.color}`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${diffConfig.dot}`}
                            ></span>
                            {diffConfig.label}
                        </span>
                        {quiz.isPaid ? (
                            <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-xs text-amber-700 dark:text-amber-300'>
                                <DollarSign size={12} />₹{quiz.price}
                            </span>
                        ) : (
                            <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg text-xs text-emerald-700 dark:text-emerald-300'>
                                <Zap size={12} />
                                Free
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className='text-3xl md:text-4xl font-bold mb-3 tracking-tight text-gray-900 dark:text-white'>
                        {quiz.title}
                    </h1>

                    {/* Description */}
                    {quiz.description && (
                        <p className='text-gray-500 dark:text-gray-400 text-base leading-relaxed max-w-2xl'>
                            {quiz.description}
                        </p>
                    )}

                    {/* Creator */}
                    {quiz.creatorId && (
                        <div className='flex items-center gap-2 mt-4'>
                            <div className='w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white'>
                                <User size={12} />
                            </div>
                            <span className='text-sm text-gray-500 dark:text-gray-400'>
                                by{' '}
                                <span className='text-gray-700 dark:text-gray-300'>
                                    {quiz.creatorId.username || quiz.creatorId.name || quiz.creatorId.email}
                                </span>
                            </span>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-8'>
                    <div className='bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-4 hover:shadow-md dark:hover:bg-white/[0.05] transition-all'>
                        <div className='flex items-center gap-2 mb-2'>
                            <div className='w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center'>
                                <BookOpen
                                    size={16}
                                    className='text-violet-600 dark:text-violet-400'
                                />
                            </div>
                        </div>
                        <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                            {quiz.questions?.length || quiz.totalQuestions || 0}
                        </p>
                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
                            Questions
                        </p>
                    </div>

                    <div className='bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-4 hover:shadow-md dark:hover:bg-white/[0.05] transition-all'>
                        <div className='flex items-center gap-2 mb-2'>
                            <div className='w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center'>
                                <Clock
                                    size={16}
                                    className='text-blue-600 dark:text-blue-400'
                                />
                            </div>
                        </div>
                        <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                            {formatDuration(duration)}
                        </p>
                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
                            Duration
                        </p>
                    </div>

                    <div className='bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-4 hover:shadow-md dark:hover:bg-white/[0.05] transition-all'>
                        <div className='flex items-center gap-2 mb-2'>
                            <div className='w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center'>
                                <Users
                                    size={16}
                                    className='text-emerald-600 dark:text-emerald-400'
                                />
                            </div>
                        </div>
                        <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                            {quiz.attemptCount || 0}
                        </p>
                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
                            Attempts
                        </p>
                    </div>

                    <div className='bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-4 hover:shadow-md dark:hover:bg-white/[0.05] transition-all'>
                        <div className='flex items-center gap-2 mb-2'>
                            <div className='w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center'>
                                <BarChart3
                                    size={16}
                                    className='text-amber-600 dark:text-amber-400'
                                />
                            </div>
                        </div>
                        <p className={`text-2xl font-bold ${diffConfig.color}`}>
                            {diffConfig.label}
                        </p>
                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
                            Difficulty
                        </p>
                    </div>
                </div>

                {/* Schedule Section */}
                {(quiz.startTime || quiz.endTime) && (
                    <div className='bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-5 mb-8'>
                        <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2'>
                            <Calendar size={14} />
                            Schedule
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {quiz.startTime && (
                                <div className='flex items-center gap-3'>
                                    <div className='w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400'></div>
                                    <div>
                                        <p className='text-xs text-gray-400 dark:text-gray-500'>
                                            Starts
                                        </p>
                                        <p className='text-sm text-gray-700 dark:text-gray-200'>
                                            {new Date(
                                                quiz.startTime,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {quiz.endTime && (
                                <div className='flex items-center gap-3'>
                                    <div className='w-2 h-2 rounded-full bg-red-500 dark:bg-red-400'></div>
                                    <div>
                                        <p className='text-xs text-gray-400 dark:text-gray-500'>
                                            Ends
                                        </p>
                                        <p className='text-sm text-gray-700 dark:text-gray-200'>
                                            {new Date(
                                                quiz.endTime,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Anti-Cheat Notice */}
                <div className='bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-5 mb-8'>
                    <div className='flex items-start gap-3'>
                        <div className='w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                            <Shield
                                size={16}
                                className='text-violet-600 dark:text-violet-400'
                            />
                        </div>
                        <div>
                            <h3 className='text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1'>
                                Anti-Cheat Protected
                            </h3>
                            <p className='text-xs text-gray-500 dark:text-gray-500 leading-relaxed'>
                                This quiz runs in fullscreen mode. Tab
                                switching, copy/paste, and developer tools are
                                monitored. After 2 warnings, your quiz will be
                                auto-submitted.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Area */}
                {quiz.status === 'approved' && (
                    <>
                        {userAttempt ? (
                            /* Already Completed */
                            <div className='space-y-4'>
                                <div className='bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 text-center'>
                                    <div className='w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-3'>
                                        <CheckCircle
                                            size={24}
                                            className='text-emerald-600 dark:text-emerald-400'
                                        />
                                    </div>
                                    <h3 className='text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-1'>
                                        Quiz Completed
                                    </h3>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                                        You scored{' '}
                                        <span className='text-gray-900 dark:text-white font-semibold'>
                                            {userAttempt.correctAnswers}
                                        </span>{' '}
                                        out of{' '}
                                        <span className='text-gray-900 dark:text-white font-semibold'>
                                            {userAttempt.totalQuestions}
                                        </span>{' '}
                                        questions
                                    </p>
                                    <p className='text-xs text-gray-400 dark:text-gray-500'>
                                        Completed on{' '}
                                        {new Date(
                                            userAttempt.createdAt,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className='flex gap-3'>
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/quiz/${quizId}/result/${userAttempt._id}`,
                                            )
                                        }
                                        className='flex-1 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/20'
                                    >
                                        <Trophy size={18} />
                                        View Result
                                    </button>
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/quiz/${quizId}/leaderboard`,
                                            )
                                        }
                                        className='px-6 py-3.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all'
                                    >
                                        <BarChart3 size={18} />
                                        Leaderboard
                                    </button>
                                </div>
                            </div>
                        ) : isOwner ? (
                            /* Owner View — no participation */
                            <div className='bg-violet-50 dark:bg-violet-500/5 border border-violet-200 dark:border-violet-500/20 rounded-2xl p-6 text-center'>
                                <div className='w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center mx-auto mb-3'>
                                    <Edit
                                        size={24}
                                        className='text-violet-600 dark:text-violet-400'
                                    />
                                </div>
                                <h3 className='text-lg font-semibold text-violet-800 dark:text-violet-300 mb-1'>
                                    You created this quiz
                                </h3>
                                <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                                    Creators cannot participate in their own quizzes.
                                </p>
                                <p className='text-sm text-gray-600 dark:text-gray-300'>
                                    <span className='font-semibold'>{quiz.attemptCount || 0}</span> attempt{(quiz.attemptCount || 0) !== 1 ? 's' : ''} so far
                                    {quiz.participantManagement?.participantCount > 0 && (
                                        <> · <span className='font-semibold'>{quiz.participantManagement.participantCount}</span> registered</>
                                    )}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Paid quiz with start time — show registration flow */}
                                {quiz.isPaid && quiz.startTime ? (
                                    <>
                                        <QuizRegistration
                                            quiz={quiz}
                                            onRegistrationComplete={() => {
                                                window.location.reload();
                                            }}
                                        />

                                        {(() => {
                                            const currentUser = JSON.parse(
                                                localStorage.getItem('user') ||
                                                    '{}',
                                            );

                                            const isRegistered =
                                                quiz?.participantManagement?.registeredUsers?.some(
                                                    (reg) => {
                                                        let regId =
                                                            typeof reg.userId ===
                                                            'object'
                                                                ? reg.userId
                                                                      ._id ||
                                                                  reg.userId
                                                                : reg.userId;
                                                        return (
                                                            String(regId) ===
                                                            String(
                                                                currentUser._id,
                                                            )
                                                        );
                                                    },
                                                );

                                            const now = new Date();
                                            const startTime = new Date(
                                                quiz.startTime,
                                            );
                                            const hasStarted = now >= startTime;
                                            const isCancelled =
                                                quiz?.autoCancel?.isCancelled ||
                                                quiz.status === 'cancelled';

                                            if (isRegistered && !isCancelled) {
                                                if (hasStarted) {
                                                    return (
                                                        <button
                                                            onClick={
                                                                handleStartQuiz
                                                            }
                                                            className='w-full mt-4 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2 text-lg transition-all shadow-lg shadow-emerald-500/20'
                                                        >
                                                            <Play size={20} />
                                                            Start Quiz Now
                                                        </button>
                                                    );
                                                } else {
                                                    return (
                                                        <button
                                                            disabled
                                                            className='w-full mt-4 px-8 py-4 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 cursor-not-allowed text-gray-400 rounded-xl font-semibold flex items-center justify-center gap-2 text-lg'
                                                        >
                                                            <Clock size={20} />
                                                            Waiting for Start
                                                            Time...
                                                        </button>
                                                    );
                                                }
                                            }

                                            if (quiz.isPaid && !isRegistered) {
                                                return null;
                                            }

                                            if (hasStarted && !isCancelled) {
                                                return (
                                                    <button
                                                        onClick={
                                                            handleStartQuiz
                                                        }
                                                        className='w-full mt-4 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2 text-lg transition-all shadow-lg shadow-emerald-500/20'
                                                    >
                                                        <Play size={20} />
                                                        Start Quiz
                                                    </button>
                                                );
                                            }

                                            return null;
                                        })()}
                                    </>
                                ) : (
                                    /* Free quiz or paid quiz without start time — immediate start */
                                    <button
                                        onClick={handleStartQuiz}
                                        className='w-full px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2.5 text-lg transition-all shadow-lg shadow-violet-500/25 group'
                                    >
                                        <Play
                                            size={22}
                                            className='group-hover:scale-110 transition-transform'
                                        />
                                        Start Quiz
                                        <ChevronRight
                                            size={18}
                                            className='opacity-60 group-hover:translate-x-0.5 transition-transform'
                                        />
                                    </button>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default QuizDetails;
