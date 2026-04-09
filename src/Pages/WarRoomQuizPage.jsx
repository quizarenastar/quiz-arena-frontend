import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Clock,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Loader,
    Users,
    BarChart3,
    X,
} from 'lucide-react';
import useWarRoomSocket from '../hooks/useWarRoomSocket';
import WarRoomResults from '../Components/warroom/WarRoomResults';
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

    // Quiz interaction state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const timerRef = useRef(null);
    const isFinishedRef = useRef(false);

    // Results review state
    const [reviewData, setReviewData] = useState(null);
    const [finishedInfo, setFinishedInfo] = useState({
        finishedCount: 0,
        totalPlayers: 0,
    });
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(null);
    const [autoRedirectCancelled, setAutoRedirectCancelled] = useState(false);

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
            },
            onQuizStart: (data) => {
                setQuizData(data);
                setResults(null);
                setReviewData(null);
                setShowLeaderboard(false);
                setAutoRedirectCountdown(null);
                setAutoRedirectCancelled(false);
                setProgress({});
                isFinishedRef.current = false;

                const answeredSet = new Set(data.answeredQuestionIndices || []);
                setCurrentIndex(answeredSet.size > 0 ? answeredSet.size : 0);
                setSelectedAnswer(null);
                setAnsweredQuestions(answeredSet);
                setIsFinished(false);
                setFinishedInfo({ finishedCount: 0, totalPlayers: 0 });
                setTimeLeft(data.duration);
            },
            onProgressUpdate: (data) => {
                setProgress((prev) => ({ ...prev, [data.userId]: data }));
            },
            onPlayerFinished: (data) => {
                toast(`${data.username} finished!`, { icon: '🏁' });
                if (data.finishedCount !== undefined) {
                    setFinishedInfo({
                        finishedCount: data.finishedCount,
                        totalPlayers: data.totalPlayers,
                    });
                }
            },
            onQuizResults: (data) => {
                setResults(data);
                clearInterval(timerRef.current);
            },
            onChatMessage: () => {},
            onMemberJoined: () => {},
            onMemberLeft: () => {},
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
        [navigate],
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
                    setIsFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [quizData, isFinished]);

    // Finish quiz effect — triggers when isFinished becomes true
    useEffect(() => {
        if (!isFinished || isFinishedRef.current || !quizData) return;
        isFinishedRef.current = true;
        clearInterval(timerRef.current);

        (async () => {
            const res = await finishQuiz(quizData.quizId);
            if (res?.success && res.questions) {
                setReviewData({
                    questions: res.questions,
                    userAnswers: res.userAnswers || [],
                });
                if (res.finishedCount !== undefined) {
                    setFinishedInfo({
                        finishedCount: res.finishedCount,
                        totalPlayers: res.totalPlayers,
                    });
                }
            }
        })();
    }, [isFinished, quizData, finishQuiz]);

    // Auto-redirect countdown when all players finished
    useEffect(() => {
        if (!results || showLeaderboard || autoRedirectCancelled) return;

        setAutoRedirectCountdown(5);
        const timer = setInterval(() => {
            setAutoRedirectCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowLeaderboard(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [results, showLeaderboard, autoRedirectCancelled]);

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
                setAnsweredQuestions(
                    (prev) => new Set([...prev, currentIndex]),
                );

                // Auto-advance to next question or finish
                if (currentIndex < quizData.questions.length - 1) {
                    setTimeout(() => {
                        setCurrentIndex((i) => i + 1);
                        setSelectedAnswer(null);
                    }, 300);
                } else {
                    setIsFinished(true);
                }
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
    if (!quizData && !reviewData && !results) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center'>
                <Loader size={40} className='animate-spin mb-4 text-violet-500' />
                <p className='text-gray-600 dark:text-gray-400'>
                    {isConnected
                        ? 'Waiting for quiz to start...'
                        : 'Connecting...'}
                </p>
                <button
                    onClick={handleBackToRoom}
                    className='mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/30'
                >
                    <ArrowLeft size={16} />
                    Back to Room
                </button>
            </div>
        );
    }

    // Leaderboard view
    if (showLeaderboard && results) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                <div className='max-w-4xl mx-auto px-4 py-6'>
                    <WarRoomResults
                        results={results.results}
                        roundNumber={results.roundNumber}
                        currentUserId={currentUserId}
                        isHost={isHost}
                        questions={results.questions}
                        onPlayAgain={handleBackToRoom}
                        onBackToLobby={() => navigate(`/war-rooms/${roomCode}`)}
                    />
                </div>
            </div>
        );
    }

    // Results review page
    if (reviewData) {
        const {
            questions: reviewQuestions,
            userAnswers: attemptAnswers,
        } = reviewData;

        const userAnswerMap = {};
        attemptAnswers.forEach((a) => {
            userAnswerMap[a.questionIndex] = a;
        });

        const correctCount = attemptAnswers.filter((a) => a.isCorrect).length;
        const allPlayersFinished = !!results;

        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                <div className='max-w-3xl mx-auto px-4 py-6'>
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <h2 className='text-2xl font-bold mb-2 text-gray-900 dark:text-white'>
                            Quiz Review
                        </h2>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Round {quizData?.roundNumber || ''} •{' '}
                            {correctCount}/{reviewQuestions.length} correct
                        </p>
                    </div>

                    {/* Questions Review */}
                    <div className='space-y-6 mb-8'>
                        {reviewQuestions.map((q, idx) => {
                            const userAnswer = userAnswerMap[idx];
                            const userSelected = userAnswer?.selectedAnswer;
                            const isCorrectAnswer = userAnswer?.isCorrect;

                            return (
                                <div
                                    key={idx}
                                    className='p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                                >
                                    <div className='flex items-start gap-3 mb-4'>
                                        <span
                                            className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                                isCorrectAnswer
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                    : userSelected !== undefined
                                                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                            }`}
                                        >
                                            {isCorrectAnswer ? (
                                                <CheckCircle size={14} />
                                            ) : userSelected !== undefined ? (
                                                <XCircle size={14} />
                                            ) : (
                                                idx + 1
                                            )}
                                        </span>
                                        <h4 className='text-sm font-semibold text-gray-900 dark:text-white leading-relaxed'>
                                            {q.question}
                                        </h4>
                                    </div>

                                    <div className='grid gap-2 mb-3'>
                                        {q.options.map((opt, optIdx) => {
                                            const isCorrectOpt =
                                                optIdx === q.correctAnswer;
                                            const isUserSelected =
                                                optIdx === userSelected;
                                            const isWrongSelection =
                                                isUserSelected && !isCorrectOpt;

                                            let classes =
                                                'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400';
                                            if (isCorrectOpt) {
                                                classes =
                                                    'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700/50 text-green-700 dark:text-green-300';
                                            } else if (isWrongSelection) {
                                                classes =
                                                    'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700/50 text-red-700 dark:text-red-300';
                                            }

                                            return (
                                                <div
                                                    key={optIdx}
                                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm ${classes}`}
                                                >
                                                    <span className='flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold'>
                                                        {isCorrectOpt ? (
                                                            <CheckCircle
                                                                size={14}
                                                                className='text-green-600 dark:text-green-400'
                                                            />
                                                        ) : isWrongSelection ? (
                                                            <XCircle
                                                                size={14}
                                                                className='text-red-600 dark:text-red-400'
                                                            />
                                                        ) : (
                                                            String.fromCharCode(
                                                                65 + optIdx,
                                                            )
                                                        )}
                                                    </span>
                                                    <span className='flex-1'>
                                                        {opt}
                                                    </span>
                                                    {isUserSelected && (
                                                        <span className='text-xs font-medium opacity-70'>
                                                            Your answer
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {q.explanation && (
                                        <div className='px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40'>
                                            <p className='text-xs text-blue-700 dark:text-blue-300'>
                                                {q.explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Leaderboard button + auto-redirect */}
                    <div className='sticky bottom-4'>
                        <div className='p-4 rounded-2xl bg-white/95 dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 backdrop-blur-xl shadow-lg'>
                            {!allPlayersFinished ? (
                                <div className='text-center'>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                                        <Loader
                                            size={14}
                                            className='inline animate-spin mr-2'
                                        />
                                        Waiting for other players (
                                        {finishedInfo.finishedCount}/
                                        {finishedInfo.totalPlayers} finished)
                                    </p>
                                    <button
                                        disabled
                                        className='w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                                    >
                                        <BarChart3 size={18} />
                                        View Leaderboard
                                    </button>
                                </div>
                            ) : (
                                <div className='text-center'>
                                    {autoRedirectCountdown !== null &&
                                    autoRedirectCountdown > 0 &&
                                    !autoRedirectCancelled ? (
                                        <div className='flex items-center justify-center gap-2 mb-3'>
                                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                Redirecting to leaderboard in{' '}
                                                {autoRedirectCountdown}s
                                            </p>
                                            <button
                                                onClick={() =>
                                                    setAutoRedirectCancelled(
                                                        true,
                                                    )
                                                }
                                                className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                                            >
                                                <X
                                                    size={14}
                                                    className='text-gray-500'
                                                />
                                            </button>
                                        </div>
                                    ) : null}
                                    <button
                                        onClick={() =>
                                            setShowLeaderboard(true)
                                        }
                                        className='w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white cursor-pointer bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-sm transition-all'
                                    >
                                        <BarChart3 size={18} />
                                        View Leaderboard
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Waiting for review data (just finished, haven't got server response yet)
    if (isFinished) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center'>
                <Loader size={40} className='animate-spin mb-4 text-violet-500' />
                <p className='text-gray-600 dark:text-gray-400'>
                    Preparing your results...
                </p>
            </div>
        );
    }

    // Active quiz
    const question = quizData.questions[currentIndex];
    const totalQ = quizData.questions.length;
    const progressPercent = (answeredQuestions.size / totalQ) * 100;
    const isUrgent = timeLeft <= 30;

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Top Bar */}
            <div className='sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 backdrop-blur-xl'>
                <div className='max-w-4xl mx-auto px-4 py-3'>
                    <div className='flex items-center justify-between'>
                        {/* Left: Topic & Progress */}
                        <div className='flex items-center gap-4'>
                            <div>
                                <h2 className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
                                    {quizData.topic}
                                </h2>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    Round {quizData.roundNumber} •{' '}
                                    {quizData.difficulty}
                                </p>
                            </div>
                        </div>

                        {/* Center: Answered count */}
                        <div className='text-center'>
                            <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                {answeredQuestions.size}/{totalQ} answered
                            </p>
                        </div>

                        {/* Right: Timer */}
                        <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                                isUrgent
                                    ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700/40'
                                    : 'bg-violet-100 dark:bg-violet-900/30 border-violet-200 dark:border-violet-700/40'
                            }`}
                        >
                            <Clock
                                size={16}
                                className={isUrgent ? 'text-red-500 animate-pulse' : 'text-violet-500'}
                            />
                            <span className={`font-mono font-bold text-sm ${isUrgent ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className='w-full h-1 rounded-full mt-3 bg-violet-100 dark:bg-violet-900/30'>
                        <div
                            className='h-full rounded-full transition-all duration-500 bg-gradient-to-r from-violet-500 to-purple-600'
                            style={{
                                width: `${progressPercent}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='max-w-3xl mx-auto px-4 py-8'>
                {/* Question Counter */}
                <div className='flex items-center justify-between mb-6'>
                    <span className='text-sm font-medium text-violet-600 dark:text-violet-300'>
                        Question {currentIndex + 1} of {totalQ}
                    </span>
                </div>

                {/* Question */}
                <div className='p-6 rounded-2xl mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-semibold leading-relaxed text-gray-900 dark:text-white'>
                        {question.question}
                    </h3>
                </div>

                {/* Options */}
                <div className='grid gap-3 mb-6'>
                    {question.options.map((opt, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isAnswered = answeredQuestions.has(currentIndex);

                        let classes =
                            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-violet-300 dark:hover:border-violet-600';
                        if (isSelected) {
                            classes =
                                'bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700/50 text-violet-700 dark:text-violet-300';
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={
                                    isAnswered || isSubmitting || isFinished
                                }
                                className={`flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all cursor-pointer disabled:cursor-default border ${classes}`}
                            >
                                <span className='flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'>
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span className='text-sm font-medium flex-1'>
                                    {opt}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Live Opponents Progress - floating sidebar */}
            {Object.keys(progress).length > 0 && (
                <div
                    className='fixed bottom-4 right-4 p-3 rounded-xl bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 backdrop-blur-xl'
                    style={{ minWidth: '180px' }}
                >
                    <p className='text-xs font-semibold mb-2 flex items-center gap-1 text-violet-600 dark:text-violet-300'>
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
                                        style={{
                                            maxWidth: '100px',
                                        }}
                                        className='text-xs truncate text-gray-700 dark:text-gray-300'
                                    >
                                        {p.username}
                                    </span>
                                    <span className='text-xs font-mono text-gray-500 dark:text-gray-400'>
                                        {p.answeredCount}/{p.totalQuestions}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
