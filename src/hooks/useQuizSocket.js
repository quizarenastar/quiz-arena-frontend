import { useEffect, useRef, useCallback, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL?.replace('/api/v1', '') ||
    'http://localhost:5000';

/**
 * Custom hook for Quiz WebSocket connection (normal quiz attempt).
 * Manages connection lifecycle and provides actions.
 */
export default function useQuizSocket(handlers = {}) {
    const socketRef = useRef(null);
    const handlersRef = useRef(handlers);
    const [isConnected, setIsConnected] = useState(false);

    handlersRef.current = handlers;

    useEffect(() => {
        const socket = io(`${SOCKET_URL}/quiz`, {
            withCredentials: true,
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            handlersRef.current.onDisconnected?.();
        });

        socket.on('connect_error', () => {
            setIsConnected(false);
        });

        socket.on('quiz:auto-submitted', (data) => {
            handlersRef.current.onAutoSubmitted?.(data);
        });

        socket.on('quiz:error', (data) => {
            handlersRef.current.onError?.(data.message || 'Socket error');
        });

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    const startQuiz = useCallback((quizId) => {
        return new Promise((resolve) => {
            socketRef.current?.emit('quiz:start', { quizId }, (res) => {
                resolve(res);
            });
        });
    }, []);

    const submitAnswer = useCallback(
        (attemptId, questionId, selectedOption, timeSpent) => {
            return new Promise((resolve) => {
                socketRef.current?.emit(
                    'quiz:submit-answer',
                    { attemptId, questionId, selectedOption, timeSpent },
                    (res) => {
                        resolve(res);
                    },
                );
            });
        },
        [],
    );

    const reportViolation = useCallback((attemptId, type, details) => {
        return new Promise((resolve) => {
            socketRef.current?.emit(
                'quiz:violation',
                { attemptId, type, details },
                (res) => {
                    resolve(res);
                },
            );
        });
    }, []);

    const finishQuiz = useCallback((attemptId) => {
        return new Promise((resolve) => {
            socketRef.current?.emit('quiz:finish', { attemptId }, (res) => {
                resolve(res);
            });
        });
    }, []);

    return {
        isConnected,
        startQuiz,
        submitAnswer,
        reportViolation,
        finishQuiz,
    };
}
