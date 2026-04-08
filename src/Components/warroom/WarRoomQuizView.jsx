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
                Math.ceil((endTime - Date.now()) / 1000),
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
            timeSpent,
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
                <div className='text-6xl mb-4 animate-pulse'>⏳</div>
                <h2 className='text-2xl font-bold mb-2 text-gray-900 dark:text-white'>
                    Quiz Completed!
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                    Your score: {score} points
                </p>
                <p className='text-sm mt-2 text-gray-500 dark:text-gray-400'>
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                        timeLeft <= 30
                            ? 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700/40'
                            : 'bg-violet-100 dark:bg-violet-900/30 border-violet-200 dark:border-violet-700/40'
                    }`}
                >
                    <Clock
                        size={16}
                        className={
                            timeLeft <= 30 ? 'text-red-500' : 'text-violet-500'
                        }
                    />
                    <span
                        className={`font-mono font-bold text-lg ${timeLeft <= 30 ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}
                    >
                        {formatTime(timeLeft)}
                    </span>
                </div>

                {/* Score & Streak */}
                <div className='flex items-center gap-4'>
                    {streak >= 2 && (
                        <div className='flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700/40'>
                            <Zap size={14} className='text-orange-500' />
                            <span className='text-sm font-bold text-orange-600 dark:text-orange-300'>
                                {streak}× Streak!
                            </span>
                        </div>
                    )}
                    <div className='px-4 py-2 rounded-xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700/40'>
                        <span className='font-bold text-green-700 dark:text-green-300'>
                            {score} pts
                        </span>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className='w-full h-2 rounded-full mb-6 overflow-hidden bg-gray-200 dark:bg-gray-700'>
                <div
                    className='h-full rounded-full transition-all duration-500 bg-gradient-to-r from-violet-500 to-purple-600'
                    style={{
                        width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                    }}
                />
            </div>

            {/* Question counter */}
            <div className='flex items-center justify-between mb-4'>
                <span className='text-sm font-medium text-violet-600 dark:text-violet-300'>
                    Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                    {question.points} point{question.points > 1 ? 's' : ''}
                </span>
            </div>

            {/* Question */}
            <div className='p-6 rounded-2xl mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-semibold leading-relaxed text-gray-900 dark:text-white'>
                    {question.question}
                </h3>
            </div>

            {/* Options */}
            <div className='space-y-3 mb-6'>
                {question.options.map((option, idx) => {
                    let optionClasses =
                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200';

                    if (answered) {
                        if (
                            answerResult &&
                            idx === answerResult.correctAnswer
                        ) {
                            optionClasses =
                                'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700/50 text-green-700 dark:text-green-300';
                        } else if (
                            idx === selectedAnswer &&
                            answerResult &&
                            !answerResult.isCorrect
                        ) {
                            optionClasses =
                                'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700/50 text-red-700 dark:text-red-300';
                        }
                    } else if (idx === selectedAnswer) {
                        optionClasses =
                            'bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700/50 text-violet-700 dark:text-violet-300';
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={answered}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all cursor-pointer disabled:cursor-default border ${optionClasses}`}
                        >
                            <span className='w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'>
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <span className='flex-1 text-sm'>{option}</span>
                            {answered &&
                                answerResult &&
                                idx === answerResult.correctAnswer && (
                                    <CheckCircle
                                        size={20}
                                        className='text-green-500'
                                    />
                                )}
                            {answered &&
                                idx === selectedAnswer &&
                                answerResult &&
                                !answerResult.isCorrect && (
                                    <XCircle
                                        size={20}
                                        className='text-red-500'
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
                        <div className='p-4 rounded-xl text-sm bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40 text-blue-700 dark:text-blue-300'>
                            <strong>Explanation:</strong>{' '}
                            {answerResult.explanation}
                        </div>
                    )}
                    <button
                        onClick={handleNext}
                        className='w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all cursor-pointer bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-sm'
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
