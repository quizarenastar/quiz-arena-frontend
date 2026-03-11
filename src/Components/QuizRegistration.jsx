import React, { useState, useEffect } from 'react';
import {
    Clock,
    Users,
    DollarSign,
    Calendar,
    CheckCircle,
    Loader,
} from 'lucide-react';
import QuizService from '../service/QuizService';
import toast from 'react-hot-toast';
import PrizePoolDisplay from './PrizePoolDisplay';

const QuizRegistration = ({ quiz, onRegistrationComplete }) => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [participantCount, setParticipantCount] = useState(
        quiz?.participantManagement?.participantCount || 0,
    );
    const [timeUntilStart, setTimeUntilStart] = useState(null);
    const [registering, setRegistering] = useState(false);
    const hasNotifiedRef = React.useRef(false); // Prevent multiple notifications

    useEffect(() => {
        // Check if user is already registered
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const isAlreadyRegistered =
            quiz?.participantManagement?.registeredUsers?.some((reg) => {
                const regId =
                    typeof reg.userId === 'object'
                        ? reg.userId._id || reg.userId
                        : reg.userId;
                return String(regId) === String(currentUser._id);
            });
        setIsRegistered(isAlreadyRegistered);

        // Update participant count from quiz data
        if (quiz?.participantManagement?.participantCount) {
            setParticipantCount(quiz.participantManagement.participantCount);
        }
    }, [quiz]);

    useEffect(() => {
        if (!quiz?.startTime) return;

        const checkTime = () => {
            const now = new Date();
            const start = new Date(quiz.startTime);
            const diff = start - now;
            return diff;
        };

        // Initial check
        const initialDiff = checkTime();
        if (initialDiff <= 0) {
            setTimeUntilStart(null);
            // DO NOT call onRegistrationComplete here -> prevents infinite loop on reload
            return;
        }

        // If we are here, quiz hasn't started yet
        setTimeUntilStart(initialDiff);

        const updateCountdown = () => {
            const diff = checkTime();

            if (diff <= 0) {
                setTimeUntilStart(null);
                // Only notify if we transit from started -> finished (which we do if we are in this interval)
                if (onRegistrationComplete && !hasNotifiedRef.current) {
                    hasNotifiedRef.current = true;
                    onRegistrationComplete();
                }
            } else {
                setTimeUntilStart(diff);
            }
        };

        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [quiz?.startTime, onRegistrationComplete]);

    const formatCountdown = (milliseconds) => {
        if (!milliseconds) return 'Starting...';

        const totalSeconds = Math.floor(milliseconds / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        }
        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        }
        if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }
        return `${seconds}s`;
    };

    const handleRegister = async () => {
        try {
            setRegistering(true);
            const response = await QuizService.registerForQuiz(quiz._id);

            if (response.success) {
                setIsRegistered(true);
                setParticipantCount((prev) => prev + 1);
                toast.success('Successfully registered for quiz!');

                // Notify parent component
                if (onRegistrationComplete) {
                    onRegistrationComplete();
                }
            }
        } catch (error) {
            toast.error(error.message || 'Failed to register for quiz');
            console.error('Registration error:', error);
        } finally {
            setRegistering(false);
        }
    };

    const isQuizStarted = timeUntilStart === null || timeUntilStart <= 0;
    const minParticipants = quiz?.participantManagement?.minParticipants || 5;
    const hasMinParticipants = participantCount >= minParticipants;

    return (
        <div className='space-y-6'>
            {/* Prize Pool Display */}
            {quiz.isPaid && (
                <PrizePoolDisplay
                    participantCount={participantCount}
                    entryFee={quiz.price}
                    minParticipants={minParticipants}
                />
            )}

            {/* Registration Card */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                    {quiz.isPaid ? 'Quiz Registration' : 'Quiz Starting Soon'}
                </h3>

                {/* Quiz Timing Info */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                    <div className='flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <Calendar className='text-blue-500' size={24} />
                        <div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                Start Time
                            </p>
                            <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                                {new Date(quiz.startTime).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
                        <Users className='text-green-500' size={24} />
                        <div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                Participants
                            </p>
                            <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                                {participantCount} / {minParticipants} minimum
                            </p>
                        </div>
                    </div>
                </div>

                {/* Countdown Timer */}
                {!isQuizStarted && (
                    <div className='mb-6 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white text-center'>
                        <p className='text-sm mb-2'>Quiz starts in</p>
                        <p className='text-4xl font-bold'>
                            {formatCountdown(timeUntilStart)}
                        </p>
                    </div>
                )}

                {/* Registration Status */}
                {isRegistered ? (
                    <div className='bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 mb-4'>
                        <div className='flex items-center justify-center space-x-2'>
                            <CheckCircle className='text-green-500' size={24} />
                            <p className='text-green-800 dark:text-green-200 font-semibold'>
                                You're registered! ₹{quiz.price} deducted from
                                wallet
                            </p>
                        </div>
                        <p className='text-center text-sm text-green-600 dark:text-green-300 mt-2'>
                            {isQuizStarted
                                ? 'Quiz has started! Click "Start Quiz" below to begin.'
                                : `Wait for the countdown to finish. ${hasMinParticipants ? '' : `Need ${minParticipants - participantCount} more participant(s).`}`}
                        </p>
                    </div>
                ) : (
                    <>
                        {quiz.isPaid && (
                            <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 mb-4'>
                                <div className='flex items-center space-x-2 mb-2'>
                                    <DollarSign
                                        className='text-yellow-600'
                                        size={20}
                                    />
                                    <p className='text-yellow-800 dark:text-yellow-200 font-semibold'>
                                        Entry Fee: ₹{quiz.price}
                                    </p>
                                </div>
                                <p className='text-sm text-yellow-700 dark:text-yellow-300'>
                                    Payment will be held in escrow until quiz
                                    completion.
                                    {participantCount < minParticipants &&
                                        ` If less than ${minParticipants} participants register, you'll receive a full refund.`}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleRegister}
                            disabled={registering || isQuizStarted}
                            className='w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-lg shadow-lg transition-colors flex items-center justify-center space-x-2'
                        >
                            {registering ? (
                                <>
                                    <Loader
                                        className='animate-spin'
                                        size={20}
                                    />
                                    <span>Registering...</span>
                                </>
                            ) : isQuizStarted ? (
                                <span>Registration Closed</span>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    <span>
                                        {quiz.isPaid
                                            ? `Register (₹${quiz.price})`
                                            : 'Register for Quiz'}
                                    </span>
                                </>
                            )}
                        </button>
                    </>
                )}

                {/* Warning for insufficient participants */}
                {isRegistered && !hasMinParticipants && !isQuizStarted && (
                    <div className='mt-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-3'>
                        <p className='text-sm text-red-800 dark:text-red-200 text-center'>
                            ⚠️ Quiz will be cancelled if less than{' '}
                            {minParticipants} participants register by start
                            time
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizRegistration;
