import { useEffect, useRef, useCallback, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL?.replace('/api/v1', '') ||
    'http://localhost:5000';

/**
 * Custom hook for War Room WebSocket connection.
 * Manages connection lifecycle, event listeners, and auto-reconnect.
 *
 * @param {string} roomCode - Room code to join
 * @param {Object} handlers - Event handler callbacks
 * @returns {{ socket, isConnected, joinRoom, leaveRoom, sendChat, toggleReady, startQuiz, submitAnswer, finishQuiz, updateSettings, kickPlayer }}
 */
export default function useWarRoomSocket(roomCode, handlers = {}) {
    const socketRef = useRef(null);
    const handlersRef = useRef(handlers);
    const [isConnected, setIsConnected] = useState(false);

    // Keep handlers ref up to date
    handlersRef.current = handlers;

    useEffect(() => {
        if (!roomCode) return;

        let isMounted = true;

        console.log('[WarRoomSocket] Connecting to:', `${SOCKET_URL}/war-room`);

        const socket = io(`${SOCKET_URL}/war-room`, {
            withCredentials: true,
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[WarRoomSocket] Connected! Socket ID:', socket.id, 'isMounted:', isMounted);
            if (!isMounted) {
                socket.disconnect();
                return;
            }
            setIsConnected(true);
            // Auto-join room on connect
            socket.emit(
                'war-room:join',
                { roomCode },
                (response) => {
                    console.log('[WarRoomSocket] Join callback:', response);
                    if (!isMounted) return;
                    if (response?.error) {
                        handlersRef.current.onError?.(response.error);
                    } else if (response?.success) {
                        handlersRef.current.onJoined?.(response);
                    }
                }
            );
        });

        socket.on('disconnect', (reason) => {
            console.log('[WarRoomSocket] Disconnected. Reason:', reason);
            if (!isMounted) return;
            setIsConnected(false);
            handlersRef.current.onDisconnected?.();
        });

        socket.on('connect_error', (err) => {
            console.error('[WarRoomSocket] Connection error:', err.message);
            if (!isMounted) return;
            setIsConnected(false);
        });

        // Room events
        socket.on('war-room:member-joined', (data) => {
            if (isMounted) handlersRef.current.onMemberJoined?.(data);
        });

        socket.on('war-room:member-left', (data) => {
            if (isMounted) handlersRef.current.onMemberLeft?.(data);
        });

        socket.on('war-room:member-ready', (data) => {
            if (isMounted) handlersRef.current.onMemberReady?.(data);
        });

        socket.on('war-room:member-kicked', (data) => {
            if (isMounted) handlersRef.current.onMemberKicked?.(data);
        });

        socket.on('war-room:settings-updated', (data) => {
            if (isMounted) handlersRef.current.onSettingsUpdated?.(data);
        });

        // Quiz events
        socket.on('war-room:countdown', (data) => {
            if (isMounted) handlersRef.current.onCountdown?.(data);
        });

        socket.on('war-room:generating', (data) => {
            if (isMounted) handlersRef.current.onGenerating?.(data);
        });

        socket.on('war-room:quiz-start', (data) => {
            if (isMounted) handlersRef.current.onQuizStart?.(data);
        });

        socket.on('war-room:progress-update', (data) => {
            if (isMounted) handlersRef.current.onProgressUpdate?.(data);
        });

        socket.on('war-room:player-finished', (data) => {
            if (isMounted) handlersRef.current.onPlayerFinished?.(data);
        });

        socket.on('war-room:quiz-results', (data) => {
            if (isMounted) handlersRef.current.onQuizResults?.(data);
        });

        // Chat events
        socket.on('war-room:chat-message', (data) => {
            if (isMounted) handlersRef.current.onChatMessage?.(data);
        });

        // Room closed
        socket.on('war-room:room-closed', (data) => {
            if (isMounted) handlersRef.current.onRoomClosed?.(data);
        });

        // Error
        socket.on('war-room:error', (data) => {
            if (isMounted) handlersRef.current.onError?.(data.message || 'Socket error');
        });

        return () => {
            console.log('[WarRoomSocket] Cleanup - disconnecting');
            isMounted = false;
            socket.removeAllListeners();
            socket.disconnect();
            socketRef.current = null;
        };
    }, [roomCode]);

    // ─── Actions ─────────────────────────────────────────────

    const sendChat = useCallback((message) => {
        socketRef.current?.emit('war-room:chat', { message }, (res) => {
            if (res?.error) handlersRef.current.onError?.(res.error);
        });
    }, []);

    const toggleReady = useCallback((isReady) => {
        socketRef.current?.emit('war-room:ready', { isReady }, (res) => {
            if (res?.error) handlersRef.current.onError?.(res.error);
        });
    }, []);

    const startQuiz = useCallback((quizSettings) => {
        socketRef.current?.emit('war-room:start-quiz', quizSettings, (res) => {
            if (res?.error) handlersRef.current.onError?.(res.error);
        });
    }, []);

    const submitAnswer = useCallback(
        (quizId, questionIndex, selectedAnswer, timeSpent) => {
            return new Promise((resolve) => {
                socketRef.current?.emit(
                    'war-room:submit-answer',
                    { quizId, questionIndex, selectedAnswer, timeSpent },
                    (res) => {
                        resolve(res);
                    }
                );
            });
        },
        []
    );

    const finishQuiz = useCallback((quizId) => {
        socketRef.current?.emit('war-room:finish-quiz', { quizId }, (res) => {
            if (res?.error) handlersRef.current.onError?.(res.error);
        });
    }, []);

    const updateSettings = useCallback((settings) => {
        socketRef.current?.emit(
            'war-room:update-settings',
            { settings },
            (res) => {
                if (res?.error) handlersRef.current.onError?.(res.error);
            }
        );
    }, []);

    const kickPlayer = useCallback((targetUserId) => {
        socketRef.current?.emit(
            'war-room:kick',
            { targetUserId },
            (res) => {
                if (res?.error) handlersRef.current.onError?.(res.error);
            }
        );
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
        sendChat,
        toggleReady,
        startQuiz,
        submitAnswer,
        finishQuiz,
        updateSettings,
        kickPlayer,
    };
}
