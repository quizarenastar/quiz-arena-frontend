import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
    Trophy,
    Clock,
    Target,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Brain,
    Home,
} from 'lucide-react';
import toast from 'react-hot-toast';
import QuizService from '../service/QuizService';

const QuizResult = () => {
    const { quizId, attemptId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [result, setResult] = useState(location.state?.result || null);
    const [loading, setLoading] = useState(!result);
    const [analysis, setAnalysis] = useState(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);

    useEffect(() => {
        if (!result) {
            fetchAttemptDetails();
        }
    }, [attemptId, result]);

    const fetchAttemptDetails = async () => {
        try {
            setLoading(true);
            const response = await QuizService.getAttemptDetails(attemptId);
            setResult(response.data);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch result details');
            console.error('Fetch Result Error:', error);
            navigate('/quizzes');
        } finally {
            setLoading(false);
        }
    };

    const generateAIAnalysis = async () => {
        if (!result) return;

        setLoadingAnalysis(true);
        try {
            // This would call your AI analysis endpoint
            // For now, we'll create a mock analysis
            const mockAnalysis = {
                overallPerformance: getPerformanceLevel(
                    result.score,
                    result.totalPossibleScore
                ),
                strengths: getStrengths(result),
                weaknesses: getWeaknesses(result),
                recommendations: getRecommendations(result),
                improvementAreas: getImprovementAreas(result),
                timeManagement: getTimeManagementAnalysis(result),
                difficultyAnalysis: getDifficultyAnalysis(result),
            };

            setAnalysis(mockAnalysis);
        } catch (error) {
            toast.error('Failed to generate AI analysis');
            console.error('AI Analysis Error:', error);
        } finally {
            setLoadingAnalysis(false);
        }
    };

    // Helper functions for analysis
    const getPerformanceLevel = (score, total) => {
        const percentage = (score / total) * 100;
        if (percentage >= 90) return 'Excellent';
        if (percentage >= 80) return 'Very Good';
        if (percentage >= 70) return 'Good';
        if (percentage >= 60) return 'Average';
        return 'Needs Improvement';
    };

    const getStrengths = (result) => {
        const strengths = [];
        if (result.accuracy > 0.8)
            strengths.push('High accuracy in answering questions');
        if (result.timeTaken < result.timeLimit * 0.8)
            strengths.push('Excellent time management');
        if (result.violationStats?.total < 2)
            strengths.push('Good focus and concentration');
        return strengths.length
            ? strengths
            : ['Completion of the quiz shows dedication'];
    };

    const getWeaknesses = (result) => {
        const weaknesses = [];
        if (result.accuracy < 0.6)
            weaknesses.push('Low accuracy suggests need for more preparation');
        if (result.timeTaken > result.timeLimit * 0.9)
            weaknesses.push('Time management could be improved');
        if (result.violationStats?.total > 5)
            weaknesses.push('Focus and concentration need attention');
        return weaknesses;
    };

    const getRecommendations = (result) => {
        const recommendations = [];
        const accuracy = result.score / result.totalPossibleScore;

        if (accuracy < 0.7) {
            recommendations.push(
                'Review the fundamental concepts of this topic'
            );
            recommendations.push(
                'Practice more questions in areas where you scored low'
            );
        }

        if (result.timeTaken > result.timeLimit * 0.8) {
            recommendations.push(
                'Practice answering questions under time pressure'
            );
            recommendations.push(
                'Learn to quickly eliminate incorrect options'
            );
        }

        if (result.violationStats?.tabSwitches > 2) {
            recommendations.push(
                'Improve focus by practicing in distraction-free environment'
            );
        }

        if (recommendations.length === 0) {
            recommendations.push('Keep up the excellent work!');
            recommendations.push(
                'Try more challenging quizzes to further improve'
            );
        }

        return recommendations;
    };

    const getImprovementAreas = (result) => {
        // This would analyze wrong answers by category/difficulty
        return [
            'Conceptual understanding',
            'Application of knowledge',
            'Time management',
            'Attention to detail',
        ];
    };

    const getTimeManagementAnalysis = (result) => {
        const timePercentage =
            (result.timeTaken / (result.timeLimit * 60)) * 100;

        if (timePercentage < 50) {
            return 'You completed the quiz very quickly. Consider taking more time to review your answers.';
        } else if (timePercentage < 80) {
            return 'Good time management! You used your time efficiently.';
        } else if (timePercentage < 100) {
            return 'You used most of the available time. Practice to improve your speed.';
        } else {
            return 'You exceeded the time limit. Focus on improving your answering speed.';
        }
    };

    const getDifficultyAnalysis = (result) => {
        // Mock difficulty analysis
        return {
            easy: { attempted: 3, correct: 3, percentage: 100 },
            medium: { attempted: 4, correct: 2, percentage: 50 },
            hard: { attempted: 3, correct: 1, percentage: 33 },
        };
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const getScoreColor = (score, total) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getGradeIcon = (score, total) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80)
            return <Trophy className='text-yellow-500' size={48} />;
        if (percentage >= 60)
            return <Target className='text-blue-500' size={48} />;
        return <AlertTriangle className='text-orange-500' size={48} />;
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Loading results...
                    </p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        Result not found
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

    const accuracy = (result.score / result.totalPossibleScore) * 100;

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
            <div className='max-w-4xl mx-auto px-4'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <div className='mb-4'>
                        {getGradeIcon(result.score, result.totalPossibleScore)}
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                        Quiz Completed!
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400'>
                        {result.quiz?.title || 'Quiz Result'}
                    </p>
                </div>

                {/* Score Overview */}
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6'>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                        <div className='text-center'>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                                Final Score
                            </p>
                            <p
                                className={`text-3xl font-bold ${getScoreColor(
                                    result.score,
                                    result.totalPossibleScore
                                )}`}
                            >
                                {result.score}/{result.totalPossibleScore}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                {accuracy.toFixed(1)}%
                            </p>
                        </div>

                        <div className='text-center'>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                                Time Taken
                            </p>
                            <p className='text-2xl font-semibold text-gray-900 dark:text-white flex items-center justify-center'>
                                <Clock size={20} className='mr-1' />
                                {formatTime(result.timeTaken)}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                of {result.timeLimit}m limit
                            </p>
                        </div>

                        <div className='text-center'>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                                Accuracy
                            </p>
                            <p className='text-2xl font-semibold text-gray-900 dark:text-white flex items-center justify-center'>
                                <Target size={20} className='mr-1' />
                                {accuracy.toFixed(1)}%
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                {result.correctAnswers ||
                                    Math.round(result.score)}{' '}
                                correct
                            </p>
                        </div>

                        <div className='text-center'>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
                                Rank
                            </p>
                            <p className='text-2xl font-semibold text-gray-900 dark:text-white flex items-center justify-center'>
                                <TrendingUp size={20} className='mr-1' />#
                                {result.rank || 'N/A'}
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                out of {result.totalAttempts || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Anti-cheat Report */}
                {result.violationStats && result.violationStats.total > 0 && (
                    <div className='bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 p-6 mb-6'>
                        <h3 className='text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4 flex items-center'>
                            <AlertTriangle size={20} className='mr-2' />
                            Anti-cheat Report
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                            <div>
                                <p className='text-yellow-700 dark:text-yellow-300'>
                                    Total Violations
                                </p>
                                <p className='font-semibold'>
                                    {result.violationStats.total}
                                </p>
                            </div>
                            <div>
                                <p className='text-yellow-700 dark:text-yellow-300'>
                                    Tab Switches
                                </p>
                                <p className='font-semibold'>
                                    {result.violationStats.tabSwitches || 0}
                                </p>
                            </div>
                            <div>
                                <p className='text-yellow-700 dark:text-yellow-300'>
                                    Time Outside
                                </p>
                                <p className='font-semibold'>
                                    {result.violationStats.timeSpentOutside ||
                                        0}
                                    s
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Question-by-Question Breakdown */}
                {result.questionBreakdown && (
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                            Question Breakdown
                        </h3>
                        <div className='space-y-4'>
                            {result.questionBreakdown.map((question, index) => (
                                <div
                                    key={index}
                                    className='border border-gray-200 dark:border-gray-600 rounded-lg p-4'
                                >
                                    <div className='flex items-start justify-between'>
                                        <div className='flex-1'>
                                            <p className='font-medium text-gray-900 dark:text-white mb-2'>
                                                Question {index + 1}:{' '}
                                                {question.text}
                                            </p>
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                                                <div>
                                                    <p className='text-gray-600 dark:text-gray-400'>
                                                        Your Answer:
                                                    </p>
                                                    <p
                                                        className={`font-medium ${
                                                            question.isCorrect
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                        }`}
                                                    >
                                                        {question.userAnswer ||
                                                            'Not answered'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className='text-gray-600 dark:text-gray-400'>
                                                        Correct Answer:
                                                    </p>
                                                    <p className='font-medium text-green-600'>
                                                        {question.correctAnswer}
                                                    </p>
                                                </div>
                                            </div>
                                            {question.explanation && (
                                                <div className='mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                                                    <p className='text-sm text-blue-800 dark:text-blue-200'>
                                                        <strong>
                                                            Explanation:
                                                        </strong>{' '}
                                                        {question.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className='ml-4'>
                                            {question.isCorrect ? (
                                                <CheckCircle
                                                    className='text-green-500'
                                                    size={24}
                                                />
                                            ) : (
                                                <XCircle
                                                    className='text-red-500'
                                                    size={24}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI Analysis Section */}
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center'>
                            <Brain className='mr-2' size={20} />
                            AI Performance Analysis
                        </h3>

                        {!analysis && (
                            <button
                                onClick={generateAIAnalysis}
                                disabled={loadingAnalysis}
                                className='px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium'
                            >
                                {loadingAnalysis
                                    ? 'Analyzing...'
                                    : 'Generate Analysis'}
                            </button>
                        )}
                    </div>

                    {analysis ? (
                        <div className='space-y-6'>
                            {/* Overall Performance */}
                            <div>
                                <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                                    Overall Performance
                                </h4>
                                <p className='text-gray-600 dark:text-gray-400'>
                                    Your performance is rated as{' '}
                                    <strong>
                                        {analysis.overallPerformance}
                                    </strong>{' '}
                                    based on your score, time management, and
                                    focus during the quiz.
                                </p>
                            </div>

                            {/* Strengths */}
                            <div>
                                <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                                    Strengths
                                </h4>
                                <ul className='space-y-1'>
                                    {analysis.strengths.map(
                                        (strength, index) => (
                                            <li
                                                key={index}
                                                className='flex items-start text-green-600'
                                            >
                                                <CheckCircle
                                                    size={16}
                                                    className='mr-2 mt-0.5 flex-shrink-0'
                                                />
                                                <span className='text-gray-600 dark:text-gray-400'>
                                                    {strength}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>

                            {/* Areas for Improvement */}
                            {analysis.weaknesses.length > 0 && (
                                <div>
                                    <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                                        Areas for Improvement
                                    </h4>
                                    <ul className='space-y-1'>
                                        {analysis.weaknesses.map(
                                            (weakness, index) => (
                                                <li
                                                    key={index}
                                                    className='flex items-start text-orange-600'
                                                >
                                                    <AlertTriangle
                                                        size={16}
                                                        className='mr-2 mt-0.5 flex-shrink-0'
                                                    />
                                                    <span className='text-gray-600 dark:text-gray-400'>
                                                        {weakness}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Recommendations */}
                            <div>
                                <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                                    Recommendations
                                </h4>
                                <ul className='space-y-1'>
                                    {analysis.recommendations.map(
                                        (recommendation, index) => (
                                            <li
                                                key={index}
                                                className='flex items-start text-blue-600'
                                            >
                                                <TrendingUp
                                                    size={16}
                                                    className='mr-2 mt-0.5 flex-shrink-0'
                                                />
                                                <span className='text-gray-600 dark:text-gray-400'>
                                                    {recommendation}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>

                            {/* Time Management Analysis */}
                            <div>
                                <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                                    Time Management
                                </h4>
                                <p className='text-gray-600 dark:text-gray-400'>
                                    {analysis.timeManagement}
                                </p>
                            </div>
                        </div>
                    ) : (
                        !loadingAnalysis && (
                            <p className='text-gray-600 dark:text-gray-400 text-center py-8'>
                                Click "Generate Analysis" to get personalized
                                insights about your performance.
                            </p>
                        )
                    )}

                    {loadingAnalysis && (
                        <div className='text-center py-8'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4'></div>
                            <p className='text-gray-600 dark:text-gray-400'>
                                Analyzing your performance...
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className='flex flex-wrap gap-4 justify-center'>
                    <button
                        onClick={() => navigate('/')}
                        className='px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center'
                    >
                        <Home size={16} className='mr-2' />
                        Home
                    </button>

                    <button
                        onClick={() => navigate('/quizzes')}
                        className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium'
                    >
                        More Quizzes
                    </button>

                    <button
                        onClick={() => navigate(`/quiz/${quizId}/leaderboard`)}
                        className='px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium flex items-center'
                    >
                        <Trophy size={16} className='mr-2' />
                        Leaderboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizResult;
