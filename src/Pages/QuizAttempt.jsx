import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Clock,
    AlertTriangle,
    Shield,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import QuizService from '../service/QuizService';
import useAntiCheat from '../hooks/useAntiCheat';

const QuizAttempt = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [attempt, setAttempt] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showViolations, setShowViolations] = useState(false);

    const timerRef = useRef(null);
    const attemptStartTime = useRef(Date.now());

    // Initialize anti-cheat system
    const antiCheat = useAntiCheat(quizId, attempt?._id, {
        detectTabSwitch: quiz?.settings?.antiCheat?.detectTabSwitch || false,
        detectCopyPaste: quiz?.settings?.antiCheat?.detectCopyPaste || false,
        forceFullscreen: quiz?.settings?.antiCheat?.forceFullscreen || false,
        maxTabSwitches: quiz?.settings?.antiCheat?.maxTabSwitches || 3,
        autoSubmitOnViolation:
            quiz?.settings?.antiCheat?.autoSubmitOnViolation || false,
        warningThreshold: 5,
    });

    useEffect(() => {
        startQuizAttempt();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [quizId]);

    // Timer effect
    useEffect(() => {
        if (timeRemaining > 0 && !submitting) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        handleAutoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timeRemaining, submitting]);

    // Auto-submit on critical violations
    useEffect(() => {
        if (antiCheat.violationStats.critical > 0 || !antiCheat.canContinue) {
            handleAutoSubmit('Anti-cheat violation detected');
        }
    }, [antiCheat.violationStats.critical, antiCheat.canContinue]);

    const startQuizAttempt = async () => {
        try {
            setLoading(true);

            // Get quiz details first
            const quizResponse = await QuizService.getQuiz(quizId);
            const quizData = quizResponse.data.quiz;

            // Check if user can afford paid quiz
            if (quizData.isPaid && quizData.price > 0) {
                // You might want to check wallet balance here
                const confirmPayment = window.confirm(
                    `This quiz costs ₹${quizData.price}. Do you want to proceed?`
                );
                if (!confirmPayment) {
                    navigate('/quizzes');
                    return;
                }
            }

            // Start the attempt
            const attemptResponse = await QuizService.startAttempt(quizId);
            const attemptData = attemptResponse.data;

            // Set quiz with questions from attempt response
            setQuiz({
                ...quizData,
                questions: attemptData.questions,
                settings: attemptData.settings || quizData.settings,
            });

            // Set attempt data with attemptId
            setAttempt({
                _id: attemptData.attemptId,
                quizId: quizId,
                startTime: new Date(),
            });

            // Set timer (timeLimit is in milliseconds from backend)
            const timeLimitSeconds = Math.floor(attemptData.timeLimit / 1000);
            setTimeRemaining(timeLimitSeconds);
            attemptStartTime.current = Date.now();

            toast.success('Quiz started! Good luck!');
        } catch (error) {
            toast.error(error.message || 'Failed to start quiz');
            console.error('Start Quiz Error:', error);
            navigate('/quizzes');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, answerIndex) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answerIndex,
        }));
    };

    const handleAutoSubmit = (reason = 'Time expired') => {
        if (submitting) return;

        toast.warning(`Quiz auto-submitted: ${reason}`);
        handleSubmit(true);
    };

    const handleSubmit = async (isAutoSubmit = false) => {
        if (submitting) return;

        const confirmSubmit =
            isAutoSubmit ||
            window.confirm(
                'Are you sure you want to submit your quiz? You cannot change your answers after submission.'
            );

        if (!confirmSubmit && !isAutoSubmit) return;

        setSubmitting(true);
        try {
            const submissionData = {
                answers: Object.keys(answers).map((questionId) => ({
                    questionId,
                    selectedOption: answers[questionId],
                })),
                timeSpent: Math.round(
                    (Date.now() - attemptStartTime.current) / 1000
                ),
                tabSwitches: antiCheat.tabSwitchCount || 0,
            };

            const response = await QuizService.submitAttempt(
                attempt._id,
                submissionData
            );
            const result = response.data;

            toast.success('Quiz submitted successfully!');

            // Navigate to results page
            navigate(`/quiz/${quizId}/result/${attempt._id}`, {
                state: { result },
            });
        } catch (error) {
            toast.error(error.message || 'Failed to submit quiz');
            console.error('Submit Quiz Error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const currentQuestion = quiz?.questions?.[currentQuestionIndex];
    const totalQuestions = quiz?.questions?.length || 0;
    const answeredQuestions = Object.keys(answers).length;

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Starting quiz...
                    </p>
                </div>
            </div>
        );
    }

    if (!quiz || !attempt) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        Quiz not found
                    </h2>
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

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Header with Timer and Progress */}
            <div className='bg-white dark:bg-gray-800 shadow-sm border-b'>
                <div className='max-w-4xl mx-auto px-4 py-4'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
                                {quiz.title}
                            </h1>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Question {currentQuestionIndex + 1} of{' '}
                                {totalQuestions}
                            </p>
                        </div>

                        <div className='flex items-center space-x-4'>
                            {/* Anti-cheat status */}
                            {quiz.settings?.antiCheat?.enabled && (
                                <button
                                    onClick={() =>
                                        setShowViolations(!showViolations)
                                    }
                                    className={`flex items-center px-3 py-1 rounded-full text-sm ${
                                        antiCheat.violationStats.critical > 0
                                            ? 'bg-red-100 text-red-800'
                                            : antiCheat.violationStats.warning >
                                              0
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}
                                >
                                    <Shield size={14} className='mr-1' />
                                    {antiCheat.violationStats.total} violations
                                </button>
                            )}

                            {/* Timer */}
                            <div
                                className={`flex items-center px-3 py-1 rounded-full ${
                                    timeRemaining < 300
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-blue-100 text-blue-800'
                                }`}
                            >
                                <Clock size={14} className='mr-1' />
                                {formatTime(timeRemaining)}
                            </div>

                            {/* Progress */}
                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                {answeredQuestions}/{totalQuestions} answered
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className='mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                        <div
                            className='bg-yellow-500 h-2 rounded-full transition-all duration-300'
                            style={{
                                width: `${
                                    (answeredQuestions / totalQuestions) * 100
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Violations Panel */}
            {showViolations && (
                <div className='bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800'>
                    <div className='max-w-4xl mx-auto px-4 py-3'>
                        <div className='flex items-start space-x-3'>
                            <AlertTriangle
                                className='text-yellow-600 mt-1'
                                size={16}
                            />
                            <div className='flex-1'>
                                <h3 className='font-medium text-yellow-800 dark:text-yellow-200'>
                                    Anti-cheat Monitoring Active
                                </h3>
                                <div className='mt-2 text-sm text-yellow-700 dark:text-yellow-300'>
                                    <p>
                                        Tab switches: {antiCheat.tabSwitchCount}
                                    </p>
                                    <p>
                                        Time spent outside:{' '}
                                        {antiCheat.timeSpentOutside}s
                                    </p>
                                    <p>
                                        Total violations:{' '}
                                        {antiCheat.violationStats.total}
                                    </p>
                                </div>
                                {antiCheat.violations.length > 0 && (
                                    <div className='mt-2 max-h-32 overflow-y-auto'>
                                        {antiCheat.violations
                                            .slice(-5)
                                            .map((violation) => (
                                                <div
                                                    key={violation.id}
                                                    className='text-xs text-yellow-600 dark:text-yellow-400'
                                                >
                                                    {violation.timestamp.toLocaleTimeString()}
                                                    : {violation.message}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Question Content */}
            <div className='max-w-4xl mx-auto px-4 py-8'>
                {currentQuestion && (
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
                        <div className='mb-6'>
                            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                                {currentQuestion.question}
                            </h2>

                            <div className='space-y-3'>
                                {currentQuestion.options.map(
                                    (option, index) => (
                                        <label
                                            key={index}
                                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                                                answers[currentQuestion._id] ===
                                                index
                                                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                            }`}
                                        >
                                            <input
                                                type='radio'
                                                name={`question-${currentQuestion._id}`}
                                                value={index}
                                                checked={
                                                    answers[
                                                        currentQuestion._id
                                                    ] === index
                                                }
                                                onChange={() =>
                                                    handleAnswerChange(
                                                        currentQuestion._id,
                                                        index
                                                    )
                                                }
                                                className='mr-3 text-yellow-500'
                                            />
                                            <span className='text-gray-900 dark:text-white flex-1'>
                                                {option}
                                            </span>
                                            {answers[currentQuestion._id] ===
                                                index && (
                                                <CheckCircle
                                                    className='text-yellow-500 ml-2'
                                                    size={20}
                                                />
                                            )}
                                        </label>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className='flex justify-between items-center'>
                            <button
                                onClick={() =>
                                    setCurrentQuestionIndex((prev) =>
                                        Math.max(0, prev - 1)
                                    )
                                }
                                disabled={currentQuestionIndex === 0}
                                className='px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium'
                            >
                                Previous
                            </button>

                            <div className='flex space-x-2'>
                                {quiz.questions.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setCurrentQuestionIndex(index)
                                        }
                                        className={`w-8 h-8 rounded-full text-sm font-medium ${
                                            index === currentQuestionIndex
                                                ? 'bg-yellow-500 text-white'
                                                : answers[
                                                      quiz.questions[index]._id
                                                  ] !== undefined
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            {currentQuestionIndex === totalQuestions - 1 ? (
                                <button
                                    onClick={() => handleSubmit()}
                                    disabled={submitting}
                                    className='px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium'
                                >
                                    {submitting
                                        ? 'Submitting...'
                                        : 'Submit Quiz'}
                                </button>
                            ) : (
                                <button
                                    onClick={() =>
                                        setCurrentQuestionIndex((prev) =>
                                            Math.min(
                                                totalQuestions - 1,
                                                prev + 1
                                            )
                                        )
                                    }
                                    className='px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium'
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Exit fullscreen warning */}
            {quiz.settings?.antiCheat?.forceFullscreen &&
                !antiCheat.isFullscreen && (
                    <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
                        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 text-center'>
                            <XCircle
                                className='text-red-500 mx-auto mb-4'
                                size={48}
                            />
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                                Fullscreen Required
                            </h3>
                            <p className='text-gray-600 dark:text-gray-400 mb-4'>
                                This quiz requires fullscreen mode. Please press
                                F11 or click the button below to continue.
                            </p>
                            <button
                                onClick={() =>
                                    document.documentElement.requestFullscreen()
                                }
                                className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium'
                            >
                                Enter Fullscreen
                            </button>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default QuizAttempt;
