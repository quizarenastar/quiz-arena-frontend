import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Clock,
    CheckCircle,
    XCircle,
    ChevronRight,
    Trophy,
    Zap,
    ArrowLeft,
    Loader,
    Users,
    Flame,
} from 'lucide-react';
import useWarRoomSocket from '../../hooks/useWarRoomSocket';
import WarRoomResults from '../../Components/warroom/WarRoomResults';
import toast from 'react-hot-toast';

export default function WarRoomQuizPage() {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((s) => s.auth);
    const currentUserId = user?._id || user?.id;

    // Quiz data from socket
    const [quizData, setQuizData] = useState(null);
    const [results, setResults] = useState(null);
    const [progress, setProgress] = useState({});
    const [room, setRoom] = useState(null);
    const [members, setMembers] = useState([]);

    // Quiz interaction state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerResult, setAnswerResult] = useState(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const timerRef = useRef(null);

    const isHost = useMemo(
        () => room?.hostId?.toString() === currentUserId,
        [room?.hostId, currentUserId],
    );

    // Socket handlers
    const handlers = useMemo(
        () => ({
            onJoined: (response) => {
                const r = response.room;
                setRoom(r);
                setMembers(r.members || []);
            },
            onQuizStart: (data) => {
                setQuizData(data);
                setResults(null);
                setProgress({});
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setAnswerResult(null);
                setScore(0);
                setStreak(0);
                setAnsweredQuestions(new Set());
                setIsFinished(false);
                // Set total time
                setTimeLeft(data.duration);
            },
            onProgressUpdate: (data) => {
                setProgress((prev) => ({ ...prev, [data.userId]: data }));
            },
            onPlayerFinished: (data) => {
                toast(`${data.username} finished!`, { icon: '🏁' });
            },
            onQuizResults: (data) => {
                setResults(data);
                setQuizData(null);
                clearInterval(timerRef.current);
            },
            onChatMessage: () => {},
            onMemberJoined: ({ member }) => {
                setMembers((prev) => {
                    if (prev.some((m) => m.userId === member.userId))
                        return prev;
                    return [...prev, member];
                });
            },
            onMemberLeft: ({ userId }) => {
                setMembers((prev) =>
                    prev.filter((m) => m.userId?.toString() !== userId),
                );
            },
            onMemberReady: () => {},
            onMemberKicked: () => {},
            onSettingsUpdated: () => {},
            onCountdown: () => {},
            onGenerating: () => {},
            onRoomClosed: () => {
                toast.error('Room has been closed');
                navigate('/war-rooms');
            },
            onError: (msg) => {
                toast.error(msg);
            },
            onDisconnected: () => {},
        }),
        [currentUserId, navigate],
    );

    const { isConnected, submitAnswer, finishQuiz } = useWarRoomSocket(
        roomCode,
        handlers,
    );

    // Global countdown timer
    useEffect(() => {
        if (!quizData || isFinished) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleFinishQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [quizData, isFinished]);

    // Handle answer submission
    const handleAnswer = useCallback(
        async (ansIdx) => {
            if (
                isSubmitting ||
                answeredQuestions.has(currentIndex) ||
                isFinished
            )
                return;

            setSelectedAnswer(ansIdx);
            setIsSubmitting(true);

            const res = await submitAnswer(
                quizData.quizId,
                currentIndex,
                ansIdx,
                quizData.questions[currentIndex]?.timeLimit -
                    (timeLeft %
                        (quizData.questions[currentIndex]?.timeLimit || 30)),
            );

            if (res?.success) {
                setAnswerResult({
                    isCorrect: res.isCorrect,
                    correctAnswer: res.correctAnswer,
                    explanation: res.explanation,
                });
                if (res.isCorrect) {
                    setScore(res.score);
                    setStreak((s) => s + 1);
                } else {
                    setStreak(0);
                }
                setAnsweredQuestions(
                    (prev) => new Set([...prev, currentIndex]),
                );
            }

            setIsSubmitting(false);
        },
        [
            currentIndex,
            isSubmitting,
            answeredQuestions,
            isFinished,
            quizData,
            timeLeft,
            submitAnswer,
        ],
    );

    // Move to next question
    const handleNext = () => {
        if (currentIndex < quizData.questions.length - 1) {
            setCurrentIndex((i) => i + 1);
            setSelectedAnswer(null);
            setAnswerResult(null);
        } else {
            handleFinishQuiz();
        }
    };

    // Finish quiz
    const handleFinishQuiz = useCallback(() => {
        if (isFinished) return;
        setIsFinished(true);
        clearInterval(timerRef.current);
        finishQuiz(quizData?.quizId);
    }, [isFinished, quizData, finishQuiz]);

    const handleBackToRoom = () => {
        navigate(`/war-rooms/${roomCode}`);
    };

    // Format time
    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    // Loading / waiting for quiz
    if (!quizData && !results) {
        return (
            <div
                className='min-h-screen flex flex-col items-center justify-center'
                style={{ background: '#0f0f1a' }}
            >
                <Loader
                    size={40}
                    className='animate-spin mb-4'
                    style={{ color: '#8b5cf6' }}
                />
                <p style={{ color: '#94a3b8' }}>
                    {isConnected
                        ? 'Waiting for quiz to start...'
                        : 'Connecting...'}
                </p>
                <button
                    onClick={handleBackToRoom}
                    className='mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer'
                    style={{
                        color: '#a78bfa',
                        background: 'rgba(139,92,246,0.1)',
                    }}
                >
                    <ArrowLeft size={16} />
                    Back to Room
                </button>
            </div>
        );
    }

    // Results view
    if (results) {
        return (
            <div className='min-h-screen' style={{ background: '#0f0f1a' }}>
                <div className='max-w-4xl mx-auto px-4 py-6'>
                    <WarRoomResults
                        results={results.results}
                        roundNumber={results.roundNumber}
                        currentUserId={currentUserId}
                        isHost={isHost}
                        questions={results.questions}
                        onPlayAgain={handleBackToRoom}
                        onBackToLobby={() => navigate('/war-rooms')}
                    />
                </div>
            </div>
        );
    }

    // Active quiz
    const question = quizData.questions[currentIndex];
    const totalQ = quizData.questions.length;
    const progressPercent = (answeredQuestions.size / totalQ) * 100;
    const isUrgent = timeLeft <= 30;

    return (
        <div className='min-h-screen' style={{ background: '#0f0f1a' }}>
            {/* Top Bar */}
            <div
                className='sticky top-0 z-10'
                style={{
                    background: 'rgba(15,15,26,0.95)',
                    borderBottom: '1px solid rgba(139,92,246,0.15)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                <div className='max-w-4xl mx-auto px-4 py-3'>
                    <div className='flex items-center justify-between'>
                        {/* Left: Topic & Progress */}
                        <div className='flex items-center gap-4'>
                            <div>
                                <h2
                                    className='text-sm font-semibold'
                                    style={{ color: '#e2e8f0' }}
                                >
                                    {quizData.topic}
                                </h2>
                                <p
                                    className='text-xs'
                                    style={{ color: '#64748b' }}
                                >
                                    Round {quizData.roundNumber} •{' '}
                                    {quizData.difficulty}
                                </p>
                            </div>
                        </div>

                        {/* Center: Score & Streak */}
                        <div className='flex items-center gap-4'>
                            <div className='text-center'>
                                <p
                                    className='text-lg font-bold'
                                    style={{ color: '#f59e0b' }}
                                >
                                    {score}
                                </p>
                                <p
                                    className='text-xs'
                                    style={{ color: '#64748b' }}
                                >
                                    Score
                                </p>
                            </div>
                            {streak >= 2 && (
                                <div
                                    className='flex items-center gap-1 px-2 py-1 rounded-lg'
                                    style={{
                                        background: 'rgba(245,158,11,0.15)',
                                        border: '1px solid rgba(245,158,11,0.3)',
                                    }}
                                >
                                    <Flame
                                        size={14}
                                        style={{ color: '#f59e0b' }}
                                    />
                                    <span
                                        className='text-xs font-bold'
                                        style={{ color: '#fbbf24' }}
                                    >
                                        {streak}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Right: Timer */}
                        <div
                            className='flex items-center gap-2 px-3 py-1.5 rounded-xl'
                            style={{
                                background: isUrgent
                                    ? 'rgba(239,68,68,0.15)'
                                    : 'rgba(139,92,246,0.1)',
                                border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.2)'}`,
                            }}
                        >
                            <Clock
                                size={16}
                                style={{
                                    color: isUrgent ? '#ef4444' : '#a78bfa',
                                    animation: isUrgent
                                        ? 'pulse 1s ease-in-out infinite'
                                        : 'none',
                                }}
                            />
                            <span
                                className='font-mono font-bold text-sm'
                                style={{
                                    color: isUrgent ? '#ef4444' : '#e2e8f0',
                                }}
                            >
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div
                        className='w-full h-1 rounded-full mt-3'
                        style={{ background: 'rgba(139,92,246,0.1)' }}
                    >
                        <div
                            className='h-full rounded-full transition-all duration-500'
                            style={{
                                width: `${progressPercent}%`,
                                background:
                                    'linear-gradient(90deg, #8b5cf6, #6d28d9)',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-3xl mx-auto px-4 py-8'>
                {/* Question Counter */}
                <div className='flex items-center justify-between mb-6'>
                    <span
                        className='text-sm font-medium'
                        style={{ color: '#a78bfa' }}
                    >
                        Question {currentIndex + 1} of {totalQ}
                    </span>
                    <span className='text-sm' style={{ color: '#64748b' }}>
                        {answeredQuestions.size} answered
                    </span>
                </div>

                {/* Question */}
                <div
                    className='p-6 rounded-2xl mb-6'
                    style={{
                        background: 'rgba(30,30,50,0.5)',
                        border: '1px solid rgba(139,92,246,0.1)',
                    }}
                >
                    <h3
                        className='text-lg font-semibold leading-relaxed'
                        style={{ color: '#f1f5f9' }}
                    >
                        {question.question}
                    </h3>
                </div>

                {/* Options */}
                <div className='grid gap-3 mb-6'>
                    {question.options.map((opt, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isCorrect =
                            answerResult && answerResult.correctAnswer === idx;
                        const isWrong =
                            answerResult &&
                            isSelected &&
                            !answerResult.isCorrect;
                        const isAnswered = answerResult !== null;

                        let bg = 'rgba(30,30,50,0.4)';
                        let border = '1px solid rgba(139,92,246,0.1)';
                        let color = '#e2e8f0';

                        if (isAnswered) {
                            if (isCorrect) {
                                bg = 'rgba(34,197,94,0.15)';
                                border = '1px solid rgba(34,197,94,0.4)';
                                color = '#4ade80';
                            } else if (isWrong) {
                                bg = 'rgba(239,68,68,0.15)';
                                border = '1px solid rgba(239,68,68,0.4)';
                                color = '#f87171';
                            } else {
                                bg = 'rgba(30,30,50,0.2)';
                                color = '#64748b';
                            }
                        } else if (isSelected) {
                            bg = 'rgba(139,92,246,0.15)';
                            border = '1px solid rgba(139,92,246,0.4)';
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={
                                    isAnswered || isSubmitting || isFinished
                                }
                                className='flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all cursor-pointer disabled:cursor-default'
                                style={{ background: bg, border, color }}
                            >
                                <span
                                    className='flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold'
                                    style={{
                                        background: isCorrect
                                            ? 'rgba(34,197,94,0.2)'
                                            : isWrong
                                              ? 'rgba(239,68,68,0.2)'
                                              : 'rgba(139,92,246,0.15)',
                                        color: isCorrect
                                            ? '#4ade80'
                                            : isWrong
                                              ? '#f87171'
                                              : '#a78bfa',
                                    }}
                                >
                                    {isCorrect ? (
                                        <CheckCircle size={18} />
                                    ) : isWrong ? (
                                        <XCircle size={18} />
                                    ) : (
                                        String.fromCharCode(65 + idx)
                                    )}
                                </span>
                                <span className='text-sm font-medium flex-1'>
                                    {opt}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {answerResult && (
                    <div
                        className='p-4 rounded-xl mb-6'
                        style={{
                            background: answerResult.isCorrect
                                ? 'rgba(34,197,94,0.08)'
                                : 'rgba(239,68,68,0.08)',
                            border: `1px solid ${answerResult.isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                        }}
                    >
                        <p
                            className='text-sm font-semibold mb-1'
                            style={{
                                color: answerResult.isCorrect
                                    ? '#4ade80'
                                    : '#f87171',
                            }}
                        >
                            {answerResult.isCorrect
                                ? '✅ Correct!'
                                : '❌ Incorrect'}
                        </p>
                        {answerResult.explanation && (
                            <p className='text-sm' style={{ color: '#94a3b8' }}>
                                {answerResult.explanation}
                            </p>
                        )}
                    </div>
                )}

                {/* Next / Finish button */}
                {answerResult && !isFinished && (
                    <button
                        onClick={handleNext}
                        className='w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all cursor-pointer'
                        style={{
                            background:
                                currentIndex < totalQ - 1
                                    ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                                    : 'linear-gradient(135deg, #f59e0b, #d97706)',
                            boxShadow: '0 4px 15px rgba(139,92,246,0.3)',
                        }}
                    >
                        {currentIndex < totalQ - 1 ? (
                            <>
                                Next Question
                                <ChevronRight size={18} />
                            </>
                        ) : (
                            <>
                                <Trophy size={18} />
                                Finish Quiz
                            </>
                        )}
                    </button>
                )}

                {/* Waiting for results */}
                {isFinished && !results && (
                    <div className='text-center py-10'>
                        <Loader
                            size={36}
                            className='animate-spin mx-auto mb-3'
                            style={{ color: '#8b5cf6' }}
                        />
                        <p className='text-sm' style={{ color: '#94a3b8' }}>
                            Waiting for all players to finish...
                        </p>
                    </div>
                )}
            </div>

            {/* Live Opponents Progress - floating sidebar */}
            {Object.keys(progress).length > 0 && !isFinished && (
                <div
                    className='fixed bottom-4 right-4 p-3 rounded-xl'
                    style={{
                        background: 'rgba(15,15,26,0.95)',
                        border: '1px solid rgba(139,92,246,0.15)',
                        backdropFilter: 'blur(12px)',
                        minWidth: '180px',
                    }}
                >
                    <p
                        className='text-xs font-semibold mb-2 flex items-center gap-1'
                        style={{ color: '#a78bfa' }}
                    >
                        <Users size={12} />
                        Live Progress
                    </p>
                    <div className='space-y-1.5'>
                        {Object.values(progress)
                            .filter((p) => p.userId !== currentUserId)
                            .map((p) => (
                                <div
                                    key={p.userId}
                                    className='flex items-center justify-between gap-3'
                                >
                                    <span
                                        className='text-xs truncate'
                                        style={{
                                            color: '#cbd5e1',
                                            maxWidth: '100px',
                                        }}
                                    >
                                        {p.username}
                                    </span>
                                    <span
                                        className='text-xs font-mono'
                                        style={{ color: '#64748b' }}
                                    >
                                        {p.answeredCount}/{p.totalQuestions}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Pulse animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
}
