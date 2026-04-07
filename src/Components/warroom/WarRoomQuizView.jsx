import { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle, XCircle, ArrowRight, Zap } from 'lucide-react';

export default function WarRoomQuizView({
    questions,
    duration,
    quizId,
    onSubmitAnswer,
    onFinish,
    startedAt,
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [answerResult, setAnswerResult] = useState(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isFinished, setIsFinished] = useState(false);

    const question = questions[currentIndex];
    const totalQuestions = questions.length;

    // Overall timer countdown
    useEffect(() => {
        if (isFinished) return;
        const endTime = new Date(startedAt).getTime() + duration * 1000;

        const timer = setInterval(() => {
            const remaining = Math.max(
                0,
                Math.ceil((endTime - Date.now()) / 1000)
            );
            setTimeLeft(remaining);
            if (remaining <= 0) {
                clearInterval(timer);
                handleFinish();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [startedAt, duration, isFinished]);

    // Reset on question change
    useEffect(() => {
        setSelectedAnswer(null);
        setAnswered(false);
        setAnswerResult(null);
        setQuestionStartTime(Date.now());
    }, [currentIndex]);

    const handleAnswer = async (optionIndex) => {
        if (answered || isFinished) return;
        setSelectedAnswer(optionIndex);
        setAnswered(true);

        const timeSpent = Date.now() - questionStartTime;
        const result = await onSubmitAnswer(
            quizId,
            currentIndex,
            optionIndex,
            timeSpent
        );

        if (result) {
            setAnswerResult(result);
            setScore(result.score || score);
            if (result.isCorrect) {
                setStreak((prev) => prev + 1);
            } else {
                setStreak(0);
            }
        }
    };

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = useCallback(() => {
        if (isFinished) return;
        setIsFinished(true);
        onFinish(quizId);
    }, [isFinished, quizId, onFinish]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (isFinished) {
        return (
            <div className='flex flex-col items-center justify-center py-16'>
                <div
                    className='text-6xl mb-4'
                    style={{
                        animation: 'pulse 2s ease-in-out infinite',
                    }}
                >
                    ⏳
                </div>
                <h2
                    className='text-2xl font-bold mb-2'
                    style={{ color: '#f1f5f9' }}
                >
                    Quiz Completed!
                </h2>
                <p style={{ color: '#94a3b8' }}>
                    Your score: {score} points
                </p>
                <p
                    className='text-sm mt-2'
                    style={{ color: '#64748b' }}
                >
                    Waiting for other players to finish...
                </p>
            </div>
        );
    }

    if (!question) return null;

    return (
        <div className='max-w-3xl mx-auto'>
            {/* Top bar */}
            <div className='flex items-center justify-between mb-6'>
                {/* Timer */}
                <div
                    className='flex items-center gap-2 px-4 py-2 rounded-xl'
                    style={{
                        background:
                            timeLeft <= 30
                                ? 'rgba(239, 68, 68, 0.15)'
                                : 'rgba(139, 92, 246, 0.1)',
                        border: `1px solid ${timeLeft <= 30 ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.2)'}`,
                    }}
                >
                    <Clock
                        size={16}
                        style={{
                            color: timeLeft <= 30 ? '#f87171' : '#a78bfa',
                        }}
                    />
                    <span
                        className='font-mono font-bold text-lg'
                        style={{
                            color: timeLeft <= 30 ? '#f87171' : '#e2e8f0',
                        }}
                    >
                        {formatTime(timeLeft)}
                    </span>
                </div>

                {/* Score & Streak */}
                <div className='flex items-center gap-4'>
                    {streak >= 2 && (
                        <div
                            className='flex items-center gap-1 px-3 py-1.5 rounded-lg'
                            style={{
                                background:
                                    'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.2))',
                                border: '1px solid rgba(249,115,22,0.3)',
                            }}
                        >
                            <Zap
                                size={14}
                                style={{ color: '#fb923c' }}
                            />
                            <span
                                className='text-sm font-bold'
                                style={{ color: '#fb923c' }}
                            >
                                {streak}× Streak!
                            </span>
                        </div>
                    )}
                    <div
                        className='px-4 py-2 rounded-xl'
                        style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34,197,94,0.2)',
                        }}
                    >
                        <span
                            className='font-bold'
                            style={{ color: '#4ade80' }}
                        >
                            {score} pts
                        </span>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div
                className='w-full h-2 rounded-full mb-6 overflow-hidden'
                style={{ background: 'rgba(30, 30, 50, 0.8)' }}
            >
                <div
                    className='h-full rounded-full transition-all duration-500'
                    style={{
                        width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                        background:
                            'linear-gradient(90deg, #8b5cf6, #6d28d9)',
                    }}
                />
            </div>

            {/* Question counter */}
            <div className='flex items-center justify-between mb-4'>
                <span
                    className='text-sm font-medium'
                    style={{ color: '#8b5cf6' }}
                >
                    Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className='text-xs' style={{ color: '#64748b' }}>
                    {question.points} point{question.points > 1 ? 's' : ''}
                </span>
            </div>

            {/* Question */}
            <div
                className='p-6 rounded-2xl mb-6'
                style={{
                    background: 'rgba(30, 30, 50, 0.6)',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
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
            <div className='space-y-3 mb-6'>
                {question.options.map((option, idx) => {
                    let optionStyle = {
                        background: 'rgba(30, 30, 50, 0.4)',
                        border: '1px solid rgba(139, 92, 246, 0.1)',
                        color: '#e2e8f0',
                    };

                    if (answered) {
                        if (
                            answerResult &&
                            idx === answerResult.correctAnswer
                        ) {
                            optionStyle = {
                                background: 'rgba(34, 197, 94, 0.15)',
                                border: '1px solid rgba(34, 197, 94, 0.5)',
                                color: '#4ade80',
                            };
                        } else if (
                            idx === selectedAnswer &&
                            answerResult &&
                            !answerResult.isCorrect
                        ) {
                            optionStyle = {
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.5)',
                                color: '#f87171',
                            };
                        }
                    } else if (idx === selectedAnswer) {
                        optionStyle = {
                            background: 'rgba(139, 92, 246, 0.2)',
                            border: '1px solid rgba(139, 92, 246, 0.5)',
                            color: '#c4b5fd',
                        };
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={answered}
                            className='w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all cursor-pointer disabled:cursor-default'
                            style={optionStyle}
                        >
                            <span
                                className='w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0'
                                style={{
                                    background:
                                        'rgba(139, 92, 246, 0.15)',
                                    color: '#a78bfa',
                                }}
                            >
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <span className='flex-1 text-sm'>
                                {option}
                            </span>
                            {answered &&
                                answerResult &&
                                idx === answerResult.correctAnswer && (
                                    <CheckCircle
                                        size={20}
                                        style={{ color: '#22c55e' }}
                                    />
                                )}
                            {answered &&
                                idx === selectedAnswer &&
                                answerResult &&
                                !answerResult.isCorrect && (
                                    <XCircle
                                        size={20}
                                        style={{ color: '#ef4444' }}
                                    />
                                )}
                        </button>
                    );
                })}
            </div>

            {/* Explanation & Next */}
            {answered && answerResult && (
                <div className='space-y-4'>
                    {answerResult.explanation && (
                        <div
                            className='p-4 rounded-xl text-sm'
                            style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                color: '#93c5fd',
                            }}
                        >
                            <strong>Explanation:</strong>{' '}
                            {answerResult.explanation}
                        </div>
                    )}
                    <button
                        onClick={handleNext}
                        className='w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all cursor-pointer'
                        style={{
                            background:
                                'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                            boxShadow:
                                '0 4px 15px rgba(139, 92, 246, 0.4)',
                        }}
                    >
                        {currentIndex < totalQuestions - 1 ? (
                            <>
                                Next Question <ArrowRight size={18} />
                            </>
                        ) : (
                            <>Finish Quiz 🏁</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
