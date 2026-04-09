import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Trophy,
    Clock,
    Target,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ArrowLeft,
    BarChart3,
    Shield,
    Brain,
    TrendingUp,
    BookOpen,
    Lightbulb,
} from 'lucide-react';
import toast from 'react-hot-toast';
import QuizService from '../service/QuizService';

const QuizResult = () => {
    const { quizId, attemptId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    // Normalize submit-response shape (from navigation state) into the same
    // shape used by the API fetch path.
    const normalizeSubmitResult = useCallback((data) => {
        const totalQuestions = data.totalQuestions || 0;
        const correctAnswers = data.correctAnswers || 0;
        const accuracy =
            data.percentage ??
            (totalQuestions > 0
                ? Math.round((correctAnswers / totalQuestions) * 100)
                : 0);
        return {
            correctAnswers,
            totalQuestions,
            accuracy,
            timeTaken: Math.floor((data.duration || 0) / 1000),
            timeLimit: 0,
            quiz: null,
            answers: (data.answers || []).map((a) => ({
                ...a,
                selectedAnswer: a.selectedOption, // normalize field name
                isCorrect: a.isCorrect,
            })),
            status: data.isValid?.isValid === false ? 'invalid' : 'completed',
            isValid: data.isValid,
            violations: [],
            analysis: data.analysis || null,
        };
    }, []);

    const fetchAttemptDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await QuizService.getAttemptDetails(attemptId);
            const { attempt, detailedAnswers, quiz } = response.data;

            const totalQuestions =
                attempt.totalQuestions ||
                attempt.answers?.length ||
                quiz.totalQuestions ||
                0;
            const correctAnswers = attempt.correctAnswers || 0;
            const accuracy =
                totalQuestions > 0
                    ? Math.round((correctAnswers / totalQuestions) * 100)
                    : 0;

            setResult({
                _id: attempt._id,
                correctAnswers,
                totalQuestions,
                accuracy,
                timeTaken: Math.floor((attempt.duration || 0) / 1000),
                timeLimit: quiz.duration || 300,
                quiz,
                answers: detailedAnswers || attempt.answers || [],
                status: attempt.status,
                violations: attempt.antiCheatViolations || [],
            });
        } catch (error) {
            toast.error(error.message || 'Failed to fetch result details');
            navigate('/quizzes');
        } finally {
            setLoading(false);
        }
    }, [attemptId, navigate]);

    useEffect(() => {
        // If navigate() passed the submit response via state, use it directly
        if (location.state?.result) {
            setResult(normalizeSubmitResult(location.state.result));
            setLoading(false);
            return;
        }
        fetchAttemptDetails();
    }, [attemptId]); // eslint-disable-line react-hooks/exhaustive-deps

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const getGrade = (accuracy) => {
        if (accuracy >= 90)
            return {
                label: 'Excellent',
                emoji: '🏆',
                color: 'text-emerald-600 dark:text-emerald-400',
                bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                border: 'border-emerald-200 dark:border-emerald-500/20',
                ring: 'stroke-emerald-500',
            };
        if (accuracy >= 70)
            return {
                label: 'Great Job',
                emoji: '🌟',
                color: 'text-blue-600 dark:text-blue-400',
                bg: 'bg-blue-50 dark:bg-blue-500/10',
                border: 'border-blue-200 dark:border-blue-500/20',
                ring: 'stroke-blue-500',
            };
        if (accuracy >= 50)
            return {
                label: 'Not Bad',
                emoji: '👍',
                color: 'text-amber-600 dark:text-amber-400',
                bg: 'bg-amber-50 dark:bg-amber-500/10',
                border: 'border-amber-200 dark:border-amber-500/20',
                ring: 'stroke-amber-500',
            };
        return {
            label: 'Keep Trying',
            emoji: '💪',
            color: 'text-red-500 dark:text-red-400',
            bg: 'bg-red-50 dark:bg-red-500/10',
            border: 'border-red-200 dark:border-red-500/20',
            ring: 'stroke-red-500',
        };
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center'>
                <div className='text-center'>
                    <div className='relative w-16 h-16 mx-auto mb-4'>
                        <div className='absolute inset-0 rounded-full border-2 border-violet-200 dark:border-violet-500/20'></div>
                        <div className='absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin'></div>
                    </div>
                    <p className='text-gray-500 text-sm'>Loading results...</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center'>
                <div className='text-center'>
                    <p className='text-xl text-gray-500 dark:text-gray-400 mb-4'>
                        Result not found
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

    const grade = getGrade(result.accuracy);
    const circumference = 2 * Math.PI * 54;
    const dashOffset = circumference - (result.accuracy / 100) * circumference;

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-[#0a0a0f] text-gray-900 dark:text-white'>
            {/* Ambient glow (dark mode) */}
            <div className='fixed inset-0 pointer-events-none hidden dark:block'>
                <div className='absolute top-0 left-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-[128px]'></div>
                <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/6 rounded-full blur-[128px]'></div>
            </div>

            <div className='relative max-w-2xl mx-auto px-4 py-6'>
                {/* Back */}
                <button
                    onClick={() => navigate(`/quiz/${quizId}`)}
                    className='flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group mb-8'
                >
                    <ArrowLeft
                        size={18}
                        className='group-hover:-translate-x-0.5 transition-transform'
                    />
                    <span className='text-sm'>Back to Quiz</span>
                </button>

                {/* Hero — Score Circle */}
                <div className='text-center mb-8'>
                    <div className='relative w-36 h-36 mx-auto mb-5'>
                        <svg
                            className='w-full h-full -rotate-90'
                            viewBox='0 0 120 120'
                        >
                            <circle
                                cx='60'
                                cy='60'
                                r='54'
                                fill='none'
                                strokeWidth='8'
                                className='stroke-gray-200 dark:stroke-white/[0.06]'
                            />
                            <circle
                                cx='60'
                                cy='60'
                                r='54'
                                fill='none'
                                strokeWidth='8'
                                strokeLinecap='round'
                                className={grade.ring}
                                strokeDasharray={circumference}
                                strokeDashoffset={dashOffset}
                                style={{
                                    transition: 'stroke-dashoffset 1s ease-out',
                                }}
                            />
                        </svg>
                        <div className='absolute inset-0 flex flex-col items-center justify-center'>
                            <span className='text-3xl font-bold'>
                                {result.accuracy}%
                            </span>
                            <span className='text-xs text-gray-400 dark:text-gray-500'>
                                Accuracy
                            </span>
                        </div>
                    </div>

                    <div className='text-3xl mb-1'>{grade.emoji}</div>
                    <h1 className={`text-2xl font-bold ${grade.color} mb-1`}>
                        {grade.label}
                    </h1>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {result.quiz?.title || 'Quiz Result'}
                    </p>
                    {result.status === 'auto-submitted' && (
                        <span className='inline-flex items-center gap-1 mt-2 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-xs text-amber-700 dark:text-amber-300'>
                            <AlertTriangle size={12} />
                            Auto-submitted
                        </span>
                    )}
                </div>

                {/* Stats Row */}
                <div className='grid grid-cols-3 gap-3 mb-6'>
                    <div className='bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-4 text-center'>
                        <div className='w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-2'>
                            <CheckCircle
                                size={16}
                                className='text-emerald-600 dark:text-emerald-400'
                            />
                        </div>
                        <p className='text-xl font-bold'>
                            {result.correctAnswers}
                            <span className='text-sm font-normal text-gray-400'>
                                /{result.totalQuestions}
                            </span>
                        </p>
                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
                            Correct
                        </p>
                    </div>

                    <div className='bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-4 text-center'>
                        <div className='w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-2'>
                            <Clock
                                size={16}
                                className='text-blue-600 dark:text-blue-400'
                            />
                        </div>
                        <p className='text-xl font-bold'>
                            {formatTime(result.timeTaken)}
                        </p>
                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
                            Time Taken
                        </p>
                    </div>

                    <div className='bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-4 text-center'>
                        <div className='w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-2'>
                            <XCircle
                                size={16}
                                className='text-red-500 dark:text-red-400'
                            />
                        </div>
                        <p className='text-xl font-bold'>
                            {result.totalQuestions - result.correctAnswers}
                        </p>
                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
                            Wrong
                        </p>
                    </div>
                </div>

                {/* isValid warning */}
                {result.isValid && !result.isValid.isValid && (
                    <div className='bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 mb-6'>
                        <div className='flex items-start gap-3'>
                            <AlertTriangle
                                size={16}
                                className='text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5'
                            />
                            <div>
                                <p className='text-sm font-semibold text-red-700 dark:text-red-400'>
                                    Attempt Flagged
                                </p>
                                <p className='text-xs text-red-600 dark:text-red-400/80 mt-0.5'>
                                    {result.isValid.reason ||
                                        'This attempt failed validation checks.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Violations */}
                {result.violations.length > 0 && (
                    <div className='bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 mb-6'>
                        <div className='flex items-center gap-2 mb-2'>
                            <Shield
                                size={16}
                                className='text-amber-600 dark:text-amber-400'
                            />
                            <span className='text-sm font-semibold text-amber-800 dark:text-amber-300'>
                                Anti-Cheat Report
                            </span>
                        </div>
                        <p className='text-xs text-gray-600 dark:text-gray-400'>
                            <span className='font-semibold'>
                                {result.violations.length}
                            </span>{' '}
                            violation
                            {result.violations.length !== 1 ? 's' : ''} detected
                            during this attempt.
                        </p>
                    </div>
                )}

                {/* Answer Breakdown */}
                {result.answers && result.answers.length > 0 && (
                    <div className='mb-6'>
                        <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3'>
                            Question Breakdown
                        </h3>
                        <div className='space-y-2'>
                            {result.answers.map((answer, i) => {
                                const isCorrect = answer.isCorrect;
                                const questionText =
                                    answer.question || `Question ${i + 1}`;
                                const options = answer.options;

                                return (
                                    <div
                                        key={i}
                                        className={`bg-white dark:bg-white/[0.03] border rounded-2xl overflow-hidden ${
                                            isCorrect
                                                ? 'border-emerald-200 dark:border-emerald-500/20'
                                                : 'border-red-200 dark:border-red-500/20'
                                        }`}
                                    >
                                        <div className='flex items-center gap-3 px-4 py-3'>
                                            <span
                                                className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center ${
                                                    isCorrect
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/10'
                                                        : 'bg-red-100 dark:bg-red-500/10'
                                                }`}
                                            >
                                                {isCorrect ? (
                                                    <CheckCircle
                                                        size={14}
                                                        className='text-emerald-600 dark:text-emerald-400'
                                                    />
                                                ) : (
                                                    <XCircle
                                                        size={14}
                                                        className='text-red-500 dark:text-red-400'
                                                    />
                                                )}
                                            </span>
                                            <div className='flex-1 min-w-0'>
                                                <p className='text-sm font-medium text-gray-800 dark:text-gray-200 truncate'>
                                                    {questionText}
                                                </p>
                                                {options && !isCorrect && (
                                                    <div className='flex flex-wrap gap-x-4 mt-1 text-xs'>
                                                        <span className='text-red-500'>
                                                            Yours:{' '}
                                                            {answer.selectedAnswer !==
                                                                null &&
                                                            answer.selectedAnswer !==
                                                                undefined
                                                                ? options[
                                                                      answer
                                                                          .selectedAnswer
                                                                  ] || 'N/A'
                                                                : 'Skipped'}
                                                        </span>
                                                        <span className='text-emerald-600 dark:text-emerald-400'>
                                                            Correct:{' '}
                                                            {options[
                                                                answer
                                                                    .correctAnswer
                                                            ] || 'N/A'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <span
                                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                    isCorrect
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                        : 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                                                }`}
                                            >
                                                {isCorrect ? '+1' : '0'}
                                            </span>
                                        </div>

                                        {/* Explanation */}
                                        {answer.explanation && (
                                            <div className='px-4 pb-3'>
                                                <p className='text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.02] rounded-lg p-2.5'>
                                                    <span className='font-semibold'>
                                                        Explanation:
                                                    </span>{' '}
                                                    {answer.explanation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* AI Analysis */}
                {result.analysis && (
                    <div className='mb-6 space-y-3'>
                        <h3 className='text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2'>
                            <Brain size={14} />
                            AI Analysis
                        </h3>

                        {/* Overall */}
                        {result.analysis.overallAssessment && (
                            <div className='bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-4'>
                                <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>
                                    {result.analysis.overallAssessment}
                                </p>
                            </div>
                        )}

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            {/* Strengths */}
                            {result.analysis.strengths?.length > 0 && (
                                <div className='bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-4'>
                                    <p className='text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-3'>
                                        <CheckCircle size={13} /> Strengths
                                    </p>
                                    <ul className='space-y-1.5'>
                                        {result.analysis.strengths.map(
                                            (s, i) => (
                                                <li
                                                    key={i}
                                                    className='text-xs text-emerald-700 dark:text-emerald-300 flex gap-2'
                                                >
                                                    <span>•</span>
                                                    {s}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Weaknesses */}
                            {result.analysis.weaknesses?.length > 0 && (
                                <div className='bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-2xl p-4'>
                                    <p className='text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5 mb-3'>
                                        <XCircle size={13} /> Weaknesses
                                    </p>
                                    <ul className='space-y-1.5'>
                                        {result.analysis.weaknesses.map(
                                            (w, i) => (
                                                <li
                                                    key={i}
                                                    className='text-xs text-red-700 dark:text-red-300 flex gap-2'
                                                >
                                                    <span>•</span>
                                                    {w}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Improvements */}
                            {result.analysis.improvements?.length > 0 && (
                                <div className='bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4'>
                                    <p className='text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5 mb-3'>
                                        <TrendingUp size={13} /> Improvements
                                    </p>
                                    <ul className='space-y-1.5'>
                                        {result.analysis.improvements.map(
                                            (item, i) => (
                                                <li
                                                    key={i}
                                                    className='text-xs text-blue-700 dark:text-blue-300 flex gap-2'
                                                >
                                                    <span>•</span>
                                                    {item}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Study Recommendations */}
                            {result.analysis.studyRecommendations?.length >
                                0 && (
                                <div className='bg-violet-50 dark:bg-violet-500/5 border border-violet-200 dark:border-violet-500/20 rounded-2xl p-4'>
                                    <p className='text-xs font-semibold text-violet-700 dark:text-violet-400 uppercase tracking-wider flex items-center gap-1.5 mb-3'>
                                        <BookOpen size={13} /> Study Tips
                                    </p>
                                    <ul className='space-y-1.5'>
                                        {result.analysis.studyRecommendations.map(
                                            (r, i) => (
                                                <li
                                                    key={i}
                                                    className='text-xs text-violet-700 dark:text-violet-300 flex gap-2'
                                                >
                                                    <span>•</span>
                                                    {r}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Time Management */}
                        {result.analysis.timeManagement && (
                            <div className='bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4'>
                                <p className='text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2'>
                                    <Clock size={13} /> Time Management
                                </p>
                                <p className='text-xs text-amber-700 dark:text-amber-300 leading-relaxed'>
                                    {result.analysis.timeManagement}
                                </p>
                            </div>
                        )}

                        {/* Encouragement */}
                        {result.analysis.encouragement && (
                            <div className='bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-500/5 dark:to-violet-500/5 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-4'>
                                <p className='text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-2'>
                                    <Lightbulb size={13} /> Encouragement
                                </p>
                                <p className='text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed'>
                                    {result.analysis.encouragement}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className='flex gap-3'>
                    <button
                        onClick={() => navigate(`/quiz/${quizId}/leaderboard`)}
                        className='flex-1 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/20'
                    >
                        <BarChart3 size={18} />
                        Leaderboard
                    </button>
                    <button
                        onClick={() => navigate('/quizzes')}
                        className='flex-1 px-6 py-3.5 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all'
                    >
                        <Target size={18} />
                        More Quizzes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizResult;
