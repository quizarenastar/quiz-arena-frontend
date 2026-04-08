import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Clock,
    AlertTriangle,
    Shield,
    CheckCircle,
    XCircle,
    Loader2,
    Send,
    Maximize,
} from 'lucide-react';
import toast from 'react-hot-toast';
import QuizService from '../service/QuizService';

const QuizAttempt = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    // Core state
    const [quiz, setQuiz] = useState(null);
    const [attemptId, setAttemptId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [currentQuestionTime, setCurrentQuestionTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submittingAnswer, setSubmittingAnswer] = useState(false);
    const [submittingQuiz, setSubmittingQuiz] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    // Anti-cheat state
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [violationCount, setViolationCount] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [violations, setViolations] = useState([]);
    const [showViolations, setShowViolations] = useState(false);
    const [quizEnded, setQuizEnded] = useState(false); // prevents interaction after auto-submit

    // Refs
    const timerRef = useRef(null);
    const questionTimerRef = useRef(null);
    const questionStartTimeRef = useRef(Date.now());
    const isInitializedRef = useRef(false);
    const isFullscreenExitingRef = useRef(false); // debounce flag to prevent ESC counting as tab switch
    const violationCountRef = useRef(0); // ref to avoid stale closures

    // ========== FULLSCREEN MANAGEMENT ==========
    const enterFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.warn('Fullscreen request failed:', err);
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFull = !!document.fullscreenElement;
            setIsFullscreen(isFull);

            if (!isFull && attemptId && !submittingQuiz && !quizEnded) {
                // Set flag so the upcoming visibilitychange event won't count as a tab switch
                isFullscreenExitingRef.current = true;
                setTimeout(() => {
                    isFullscreenExitingRef.current = false;
                }, 500); // debounce for 500ms

                // Record fullscreen exit as a violation (counts toward auto-submit)
                handleViolation('fullscreen_exit', 'User exited fullscreen');
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange,
            );
            // Exit fullscreen when leaving the page
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        };
    }, [attemptId, submittingQuiz, quizEnded]);

    // ========== TAB SWITCH DETECTION ==========
    useEffect(() => {
        if (!attemptId || submittingQuiz || quizEnded) return;

        const handleVisibilityChange = () => {
            if (document.hidden) return;
            if (isFullscreenExitingRef.current) return;
            handleViolation('tab_switch', 'Tab switch detected');
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
        };
    }, [attemptId, submittingQuiz, quizEnded]);

    // ========== COPY/PASTE/RIGHT-CLICK/DEVTOOLS BLOCKING ==========
    useEffect(() => {
        if (!attemptId) return;

        const blockCopy = (e) => {
            e.preventDefault();
            handleViolation('copy_paste', 'Copy attempt blocked');
        };
        const blockPaste = (e) => {
            e.preventDefault();
            handleViolation('copy_paste', 'Paste attempt blocked');
        };
        const blockContextMenu = (e) => {
            e.preventDefault();
        };
        const blockKeys = (e) => {
            if (
                (e.ctrlKey &&
                    ['c', 'v', 'x', 'a', 's', 'p', 'f'].includes(
                        e.key.toLowerCase(),
                    )) ||
                (e.altKey && e.key === 'Tab') ||
                e.key === 'F12' ||
                (e.ctrlKey &&
                    e.shiftKey &&
                    ['i', 'j', 'c'].includes(e.key.toLowerCase()))
            ) {
                e.preventDefault();
                handleViolation('devtools', `Blocked shortcut: ${e.key}`);
            }
        };

        document.addEventListener('copy', blockCopy);
        document.addEventListener('paste', blockPaste);
        document.addEventListener('contextmenu', blockContextMenu);
        document.addEventListener('keydown', blockKeys);

        return () => {
            document.removeEventListener('copy', blockCopy);
            document.removeEventListener('paste', blockPaste);
            document.removeEventListener('contextmenu', blockContextMenu);
            document.removeEventListener('keydown', blockKeys);
        };
    }, [attemptId]);

    // ========== UNIFIED VIOLATION HANDLER ==========
    // ALL violation types (tab switch, copy/paste, devtools, fullscreen exit)
    // count toward the 2-warning auto-submit limit.
    const handleViolation = (type, details) => {
        violationCountRef.current += 1;
        const count = violationCountRef.current;
        setViolationCount(count);

        // Store violation in state
        setViolations((prev) => [
            ...prev,
            {
                id: Date.now(),
                type,
                message: details,
                timestamp: new Date(),
            },
        ]);

        // Report to server
        if (attemptId) {
            QuizService.reportViolation(attemptId, { type, details }).catch(
                (err) => console.error('Failed to report violation:', err),
            );
        }

        if (count <= 2) {
            // 1st and 2nd violation → warning
            setWarningMessage(
                `${details} (Violation ${count}/2). Your quiz will be auto-submitted after the next violation!`,
            );
            setShowWarning(true);
            toast.error(
                `⚠️ Warning ${count}/2: ${details}. Next violation = auto-submit!`,
            );
        } else {
            // 3rd+ violation → auto-submit
            handleAutoSubmit(`Too many violations (${count}) — auto-submitted`);
        }
    };

    // ========== TIMER ==========
    useEffect(() => {
        if (timeRemaining > 0 && !submittingQuiz && !isComplete) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        handleAutoSubmit('Time expired');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timeRemaining, submittingQuiz, isComplete]);

    // Per-question timer
    useEffect(() => {
        if (currentQuestion?.timeLimit && !submittingQuiz && !isComplete) {
            setCurrentQuestionTime(currentQuestion.timeLimit);
            questionTimerRef.current = setInterval(() => {
                setCurrentQuestionTime((prev) => {
                    if (prev <= 1) {
                        // Auto-submit current answer (even if not selected) and move on
                        handleSubmitAnswer(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (questionTimerRef.current)
                clearInterval(questionTimerRef.current);
        };
    }, [currentQuestion?._id, submittingQuiz, isComplete]);

    // ========== START QUIZ ==========
    useEffect(() => {
        if (isInitializedRef.current) return;
        isInitializedRef.current = true;

        startQuizAttempt();
    }, [quizId]);

    const startQuizAttempt = async () => {
        try {
            setLoading(true);

            // Get quiz details first
            const quizResponse = await QuizService.getQuiz(quizId);
            const quizData = quizResponse.data.quiz;
            setQuiz(quizData);

            // Request fullscreen immediately
            await enterFullscreen();

            // Start the attempt
            const attemptResponse = await QuizService.startAttempt(quizId);
            const attemptData = attemptResponse.data;

            setAttemptId(attemptData.attemptId);
            setCurrentQuestion(attemptData.currentQuestion);
            setCurrentQuestionIndex(attemptData.currentQuestionIndex);
            setTotalQuestions(attemptData.totalQuestions);
            setAnsweredCount(attemptData.answeredCount || 0);

            // Set timer
            const timeLimitSeconds = Math.floor(
                (attemptData.timeLimit || attemptData.timeRemaining) / 1000,
            );
            setTimeRemaining(timeLimitSeconds);
            questionStartTimeRef.current = Date.now();

            toast.success('Quiz started! Good luck!');
        } catch (error) {
            toast.error(error.message || 'Failed to start quiz');
            console.error('Start Quiz Error:', error);
            navigate('/quizzes');
        } finally {
            setLoading(false);
        }
    };

    // ========== SUBMIT SINGLE ANSWER ==========
    const handleSubmitAnswer = async () => {
        if (submittingAnswer || submittingQuiz || !currentQuestion) return;

        setSubmittingAnswer(true);
        try {
            const timeSpent = Math.round(
                (Date.now() - questionStartTimeRef.current) / 1000,
            );

            const response = await QuizService.submitSingleAnswer(attemptId, {
                questionId: currentQuestion._id,
                selectedOption: selectedOption !== null ? selectedOption : null,
                timeSpent,
            });

            const data = response.data;

            if (data.isComplete) {
                // All questions answered → submit quiz
                setIsComplete(true);
                handleFinalSubmit();
                return;
            }

            // Load next question
            setCurrentQuestion(data.currentQuestion);
            setCurrentQuestionIndex(data.currentQuestionIndex);
            setAnsweredCount(data.answeredCount);
            setSelectedOption(null);
            questionStartTimeRef.current = Date.now();

            // Update remaining time from server
            if (data.timeRemaining !== undefined) {
                setTimeRemaining(Math.floor(data.timeRemaining / 1000));
            }
        } catch (error) {
            if (error.expired) {
                handleAutoSubmit('Quiz time expired');
                return;
            }
            toast.error(error.message || 'Failed to submit answer');
            console.error('Submit answer error:', error);
        } finally {
            setSubmittingAnswer(false);
        }
    };

    // ========== FINAL SUBMIT (after all questions or auto-submit) ==========
    const handleFinalSubmit = async () => {
        if (submittingQuiz) return;
        setSubmittingQuiz(true);
        setQuizEnded(true); // Block all further interaction immediately

        try {
            await QuizService.submitAttempt(attemptId, {
                answers: [], // Server already has all answers
                timeSpent: 0,
                tabSwitches: violationCount,
            });

            // Exit fullscreen
            if (document.fullscreenElement) {
                await document.exitFullscreen().catch(() => {});
            }

            toast.success('Quiz submitted successfully!');
            navigate(`/quiz/${quizId}/result/${attemptId}`);
        } catch (error) {
            // Even on error, exit fullscreen and redirect
            if (document.fullscreenElement) {
                await document.exitFullscreen().catch(() => {});
            }
            toast.error(error.message || 'Failed to submit quiz');
            console.error('Final submit error:', error);
            // Still redirect to results page
            navigate(`/quiz/${quizId}/result/${attemptId}`);
        } finally {
            setSubmittingQuiz(false);
        }
    };

    const handleAutoSubmit = (reason = 'Auto-submitted') => {
        if (submittingQuiz || quizEnded) return;
        toast.error(`Quiz auto-submitted: ${reason}`);
        handleFinalSubmit();
    };

    // ========== HELPERS ==========
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // ========== RENDER ==========

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

    if (!quiz || !attemptId) {
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
            {/* ===== FULLSCREEN OVERLAY ===== */}
            {!isFullscreen && !submittingQuiz && !quizEnded && (
                <div className='fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50'>
                    <div className='bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl'>
                        <XCircle
                            className='text-red-500 mx-auto mb-4'
                            size={56}
                        />
                        <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                            Fullscreen Required
                        </h3>
                        <p className='text-gray-600 dark:text-gray-400 mb-6'>
                            This quiz must be taken in fullscreen mode to
                            prevent cheating. Please click below to continue.
                        </p>
                        <button
                            onClick={enterFullscreen}
                            className='px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex items-center justify-center mx-auto transition-colors'
                        >
                            <Maximize size={18} className='mr-2' />
                            Enter Fullscreen
                        </button>
                    </div>
                </div>
            )}

            {/* ===== VIOLATION WARNING MODAL ===== */}
            {showWarning && (
                <div className='fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50'>
                    <div className='bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg mx-4 text-center shadow-2xl border-2 border-red-500'>
                        <AlertTriangle
                            className='text-red-500 mx-auto mb-4'
                            size={56}
                        />
                        <h3 className='text-xl font-bold text-red-600 dark:text-red-400 mb-3'>
                            ⚠️ Violation Detected!
                        </h3>
                        <p className='text-gray-700 dark:text-gray-300 mb-4 text-lg'>
                            {warningMessage}
                        </p>
                        <p className='text-red-600 dark:text-red-400 font-bold mb-2'>
                            Violations: {violationCount} / 2
                        </p>
                        <p className='text-red-600 dark:text-red-400 font-bold mb-6'>
                            WARNING: Your quiz will be automatically submitted
                            after the next violation!
                        </p>
                        <button
                            onClick={() => {
                                setShowWarning(false);
                                enterFullscreen();
                            }}
                            className='px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors'
                        >
                            I Understand — Continue Quiz
                        </button>
                    </div>
                </div>
            )}

            {/* ===== HEADER ===== */}
            <div className='bg-white dark:bg-gray-800 shadow-sm border-b'>
                <div className='max-w-4xl mx-auto px-4 py-4'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                Question {currentQuestionIndex + 1} of{' '}
                                {totalQuestions}
                            </p>
                        </div>

                        <div className='flex items-center space-x-4'>
                            {/* Anti-cheat status */}
                            <button
                                onClick={() =>
                                    setShowViolations(!showViolations)
                                }
                                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                                    violations.length > 0
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                }`}
                            >
                                <Shield size={14} className='mr-1' />
                                {violations.length} violations
                            </button>

                            {/* Total Quiz Timer */}
                            <div
                                className={`flex items-center px-3 py-1 rounded-full font-semibold ${
                                    timeRemaining < 300
                                        ? 'bg-red-100 text-red-800 animate-pulse'
                                        : 'bg-blue-100 text-blue-800'
                                }`}
                            >
                                <Clock size={14} className='mr-1' />
                                {formatTime(timeRemaining)}
                            </div>

                            {/* Question Timer */}
                            {currentQuestion?.timeLimit && (
                                <div
                                    className={`flex items-center px-3 py-1 rounded-full ${
                                        currentQuestionTime < 10
                                            ? 'bg-red-100 text-red-800 animate-pulse'
                                            : currentQuestionTime < 20
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-green-100 text-green-800'
                                    }`}
                                >
                                    <Clock size={14} className='mr-1' />
                                    <span className='font-semibold'>
                                        {currentQuestionTime}s
                                    </span>
                                </div>
                            )}

                            {/* Progress */}
                            <div className='text-sm text-gray-600 dark:text-gray-400'>
                                {answeredCount}/{totalQuestions} done
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className='mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                        <div
                            className='bg-yellow-500 h-2 rounded-full transition-all duration-300'
                            style={{
                                width: `${(answeredCount / totalQuestions) * 100}%`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Violations Panel */}
            {showViolations && violations.length > 0 && (
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
                                <div className='mt-2 max-h-32 overflow-y-auto'>
                                    {violations.slice(-5).map((v) => (
                                        <div
                                            key={v.id}
                                            className='text-xs text-yellow-600 dark:text-yellow-400'
                                        >
                                            {v.timestamp.toLocaleTimeString()}:{' '}
                                            {v.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== QUESTION CONTENT ===== */}
            <div className='max-w-4xl mx-auto px-4 py-8'>
                {submittingAnswer ? (
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center'>
                        <Loader2
                            className='animate-spin mx-auto text-yellow-500 mb-4'
                            size={48}
                        />
                        <p className='text-gray-600 dark:text-gray-400'>
                            Loading next question...
                        </p>
                    </div>
                ) : currentQuestion ? (
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
                        {/* Question Progress */}
                        <div className='mb-4 flex items-center justify-between'>
                            <div className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                                Question {currentQuestionIndex + 1} of{' '}
                                {totalQuestions}
                            </div>
                            <div className='flex items-center space-x-2'>
                                <div className='w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                                    <div
                                        className='bg-yellow-500 h-2 rounded-full transition-all duration-300'
                                        style={{
                                            width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Question Text */}
                        <div className='mb-6'>
                            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                                {currentQuestion.question}
                            </h2>

                            {/* Options */}
                            <div className='space-y-3'>
                                {currentQuestion.options?.map(
                                    (option, index) => (
                                        <label
                                            key={index}
                                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                                                selectedOption === index
                                                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                            }`}
                                        >
                                            <input
                                                type='radio'
                                                name='question-option'
                                                value={index}
                                                checked={
                                                    selectedOption === index
                                                }
                                                onChange={() =>
                                                    setSelectedOption(index)
                                                }
                                                className='mr-3 text-yellow-500'
                                            />
                                            <span className='text-gray-900 dark:text-white flex-1'>
                                                {option}
                                            </span>
                                            {selectedOption === index && (
                                                <CheckCircle
                                                    className='text-yellow-500 ml-2'
                                                    size={20}
                                                />
                                            )}
                                        </label>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Submit Answer Button */}
                        <div className='flex justify-end'>
                            {currentQuestionIndex === totalQuestions - 1 ? (
                                <button
                                    onClick={() => handleSubmitAnswer()}
                                    disabled={submittingAnswer}
                                    className='px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center transition-colors'
                                >
                                    <Send size={16} className='mr-2' />
                                    {submittingAnswer
                                        ? 'Submitting...'
                                        : 'Submit & Finish'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleSubmitAnswer()}
                                    disabled={submittingAnswer}
                                    className='px-6 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors'
                                >
                                    {submittingAnswer
                                        ? 'Submitting...'
                                        : 'Next Question →'}
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center'>
                        <Loader2
                            className='animate-spin mx-auto text-yellow-500 mb-4'
                            size={48}
                        />
                        <p className='text-gray-600 dark:text-gray-400'>
                            Finishing quiz...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizAttempt;
