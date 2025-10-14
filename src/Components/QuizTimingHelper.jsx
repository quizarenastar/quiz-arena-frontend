import React from 'react';
import { Info, Clock } from 'lucide-react';

const QuizTimingHelper = ({
    totalDuration,
    questions,
    onTotalDurationChange,
    onQuestionsUpdate,
}) => {
    // Calculate total duration from all questions (in seconds)
    const calculateTotalFromQuestions = () => {
        const total = questions.reduce(
            (sum, q) => sum + (parseInt(q.timeLimit) || 30),
            0
        );
        return total; // Return in seconds
    };

    // Calculate average time per question from total duration
    const calculateTimePerQuestion = () => {
        if (!totalDuration || questions.length === 0) return 30;
        return Math.floor(totalDuration / questions.length);
    };

    // Format seconds to display with minutes if > 60
    const formatDuration = (seconds) => {
        if (seconds < 60) {
            return `${seconds}s`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return remainingSeconds > 0
            ? `${minutes}m ${remainingSeconds}s (${seconds}s)`
            : `${minutes}m (${seconds}s)`;
    };

    // Handle total duration change - distribute to all questions
    const handleTotalDurationChange = (e) => {
        const newTotal = parseInt(e.target.value) || 0;

        if (onTotalDurationChange) {
            onTotalDurationChange(newTotal);
        }

        if (questions.length > 0 && newTotal > 0 && onQuestionsUpdate) {
            const timePerQuestion = Math.floor(newTotal / questions.length);
            const updatedQuestions = questions.map((q) => ({
                ...q,
                timeLimit: timePerQuestion,
            }));
            onQuestionsUpdate(updatedQuestions);
        }
    };

    // Distribute time equally across all questions
    const distributeTimeEqually = () => {
        if (questions.length === 0 || !onQuestionsUpdate) return;

        const timePerQuestion = calculateTimePerQuestion();
        const updatedQuestions = questions.map((q) => ({
            ...q,
            timeLimit: timePerQuestion,
        }));
        onQuestionsUpdate(updatedQuestions);
    };

    return (
        <div className='bg-blue-50 mt-3 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 space-y-4'>
            <div className='flex items-start space-x-2'>
                <Info className='w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5' />
                <div className='text-sm text-blue-800 dark:text-blue-200'>
                    <p className='font-semibold mb-1'>
                        Quiz Timing Instructions:
                    </p>
                    <ul className='list-disc list-inside space-y-1 text-xs'>
                        <li>
                            Set <strong>Total Duration (seconds)</strong> to
                            automatically distribute time equally across all
                            questions
                        </li>
                        <li>
                            Or set individual{' '}
                            <strong>Question Time Limits (seconds)</strong> to
                            auto-calculate total duration
                        </li>
                        <li>Default per-question time is 30 seconds</li>
                        <li>
                            Durations over 60 seconds will show in minutes +
                            seconds format for clarity
                        </li>
                        <li>
                            Questions auto-submit when their time expires during
                            the quiz
                        </li>
                    </ul>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        <Clock className='w-4 h-4 inline mr-2' />
                        Total Quiz Duration (seconds)
                    </label>
                    <input
                        type='number'
                        min='10'
                        step='10'
                        value={totalDuration}
                        onChange={handleTotalDurationChange}
                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                        placeholder='e.g., 300'
                    />
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                        Calculated from questions:{' '}
                        {formatDuration(calculateTotalFromQuestions())}
                    </p>
                </div>

                <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                        Average Time Per Question
                    </label>
                    <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                        {formatDuration(calculateTimePerQuestion())}
                    </div>
                    <button
                        type='button'
                        onClick={distributeTimeEqually}
                        className='text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2'
                    >
                        Distribute equally to all questions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizTimingHelper;
