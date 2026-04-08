import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Clock,
    CheckCircle,
    XCircle,
    ChevronRight,
    Trophy,
    ArrowLeft,
    Loader,
    Users,
    Flame,
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
            },
            onQuizStart: (data) => {
                setQuizData(data);
                setResults(null);
                setProgress({});

                const answeredSet = new Set(data.answeredQuestionIndices || []);
                setCurrentIndex(answeredSet.size > 0 ? answeredSet.size : 0);
                setSelectedAnswer(null);
                setAnswerResult(null);
                setScore(data.currentScore || 0);
                setStreak(0); // Optional: if we want to track streak, we'd need more data, resolving it to 0 is fine on reconnect
                setAnsweredQuestions(answeredSet);
                setIsFinished(false);
                // Set total time left
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

    // Results view
    if (results) {
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

                        {/* Center: Score & Streak */}
                        <div className='flex items-center gap-4'>
                            <div className='text-center'>
                                <p className='text-lg font-bold text-amber-500'>
                                    {score}
                                </p>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    Score
                                </p>
                            </div>
                            {streak >= 2 && (
                                <div className='flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/40'>
                                    <Flame size={14} className='text-amber-500' />
                                    <span className='text-xs font-bold text-amber-600 dark:text-amber-300'>
                                        {streak}
                                    </span>
                                </div>
                            )}
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
                    <span className='text-sm text-gray-500 dark:text-gray-400'>
                        {answeredQuestions.size} answered
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
                        const isCorrect =
                            answerResult && answerResult.correctAnswer === idx;
                        const isWrong =
                            answerResult &&
                            isSelected &&
                            !answerResult.isCorrect;
                        const isAnswered = answerResult !== null;

                        let classes =
                            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200';

                        if (isAnswered) {
                            if (isCorrect) {
                                classes =
                                    'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700/50 text-green-700 dark:text-green-300';
                            } else if (isWrong) {
                                classes =
                                    'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700/50 text-red-700 dark:text-red-300';
                            } else {
                                classes =
                                    'bg-gray-100 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400';
                            }
                        } else if (isSelected) {
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
                                <span
                                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                                        isCorrect
                                            ? 'bg-green-200 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                                            : isWrong
                                              ? 'bg-red-200 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                                              : 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                                    }`}
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
                    <div className={`p-4 rounded-xl mb-6 border ${
                        answerResult.isCorrect
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/40'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40'
                    }`}>
                        <p className={`text-sm font-semibold mb-1 ${
                            answerResult.isCorrect
                                ? 'text-green-700 dark:text-green-300'
                                : 'text-red-700 dark:text-red-300'
                        }`}>
                            {answerResult.isCorrect
                                ? '✅ Correct!'
                                : '❌ Incorrect'}
                        </p>
                        {answerResult.explanation && (
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                {answerResult.explanation}
                            </p>
                        )}
                    </div>
                )}

                {/* Next / Finish button */}
                {answerResult && !isFinished && (
                    <button
                        onClick={handleNext}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all cursor-pointer shadow-sm ${
                            currentIndex < totalQ - 1
                                ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'
                                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                        }`}
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
                        <Loader size={36} className='animate-spin mx-auto mb-3 text-violet-500' />
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Waiting for all players to finish...
                        </p>
                    </div>
                )}
            </div>

            {/* Live Opponents Progress - floating sidebar */}
            {Object.keys(progress).length > 0 && !isFinished && (
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
