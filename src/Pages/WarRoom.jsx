import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Swords,
    Copy,
    Check,
    Play,
    Loader,
    ArrowLeft,
    Users,
    Clock,
    Zap,
    Share2,
    History,
} from 'lucide-react';
import useWarRoomSocket from '../hooks/useWarRoomSocket';
import WarRoomChat from '../Components/warroom/WarRoomChat';
import WarRoomMemberList from '../Components/warroom/WarRoomMemberList';
import StartQuizModal from '../Components/warroom/StartQuizModal';
import toast from 'react-hot-toast';

export default function WarRoom() {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((s) => s.auth);
    const currentUserId = user?._id || user?.id;

    // Room state
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [members, setMembers] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [copied, setCopied] = useState(false);

    // Quiz flow
    const [showStartModal, setShowStartModal] = useState(false);
    const [startingQuiz, setStartingQuiz] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [generating, setGenerating] = useState(false);

    const isHost = useMemo(
        () => room?.hostId?.toString() === currentUserId,
        [room?.hostId, currentUserId],
    );

    // Socket handlers
    const handlers = useMemo(
        () => ({
            onJoined: (response) => {
                const r = response.room;
                setRoom(r);
                setMembers(r.members || []);
                setMessages(response.messages || []);

                // Restore ready state
                const me = r.members?.find(
                    (m) => m.userId?.toString() === currentUserId,
                );
                if (me) setIsReady(me.isReady);
            },
            onMemberJoined: ({ member }) => {
                setMembers((prev) => {
                    if (prev.some((m) => m.userId === member.userId))
                        return prev;
                    return [...prev, member];
                });
            },
            onMemberLeft: ({ userId, newHostId }) => {
                setMembers((prev) =>
                    prev.filter((m) => m.userId?.toString() !== userId),
                );
                if (newHostId) {
                    setRoom((prev) =>
                        prev ? { ...prev, hostId: newHostId } : prev,
                    );
                    setMembers((prev) =>
                        prev.map((m) =>
                            m.userId?.toString() === newHostId
                                ? { ...m, role: 'host' }
                                : m,
                        ),
                    );
                }
            },
            onMemberReady: ({ userId, isReady: ready }) => {
                setMembers((prev) =>
                    prev.map((m) =>
                        m.userId?.toString() === userId
                            ? { ...m, isReady: ready }
                            : m,
                    ),
                );
            },
            onMemberKicked: (data) => {
                if (data.kicked) {
                    toast.error('You have been removed from the room');
                    navigate('/war-rooms');
                    return;
                }
                setMembers((prev) =>
                    prev.filter((m) => m.userId?.toString() !== data.userId),
                );
                toast(`${data.username} was removed`);
            },
            onSettingsUpdated: () => {},
            onCountdown: ({ seconds }) => {
                setCountdown(seconds);
                setGenerating(false);
                setShowStartModal(false);
            },
            onGenerating: () => {
                setGenerating(true);
                setCountdown(null);
                setShowStartModal(false);
            },
            onQuizStart: () => {
                // Navigate to the full-page quiz
                navigate(`/war-rooms/${roomCode}/quiz`);
            },
            onProgressUpdate: () => {},
            onPlayerFinished: () => {},
            onQuizResults: () => {
                // If results come while on this page, do nothing
                // User sees results on the quiz page
            },
            onChatMessage: (msg) => {
                setMessages((prev) => [...prev, msg]);
            },
            onRoomClosed: () => {
                toast.error('Room has been closed');
                navigate('/war-rooms');
            },
            onError: (msg) => {
                toast.error(msg);
                setStartingQuiz(false);
            },
            onDisconnected: () => {},
        }),
        [currentUserId, navigate, roomCode],
    );

    const { isConnected, sendChat, toggleReady, startQuiz, kickPlayer } =
        useWarRoomSocket(roomCode, handlers);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        toast.success('Room code copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleToggleReady = () => {
        const newReady = !isReady;
        setIsReady(newReady);
        toggleReady(newReady);
    };

    const handleStartQuiz = (quizSettings) => {
        setStartingQuiz(true);
        startQuiz(quizSettings);
    };

    const readyCount = members.filter((m) => m.isReady).length;
    const onlineCount = members.filter((m) => m.isOnline).length;

    // ─── MAIN RENDER ─────────────────────────────────────────

    if (!room) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <Loader
                        size={40}
                        className='animate-spin mx-auto mb-4 text-violet-500'
                    />
                    <p className='text-gray-600 dark:text-gray-400'>
                        {isConnected
                            ? 'Joining War Room...'
                            : 'Connecting to War Room...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='max-w-7xl mx-auto px-4 py-4'>
                {/* Top Bar */}
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={() => navigate('/war-rooms')}
                            className='p-2 rounded-lg transition-colors cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className='text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white'>
                                <Swords size={20} className='text-violet-500' />
                                {room?.name || 'War Room'}
                            </h1>
                            {room?.description && (
                                <p className='text-xs mt-0.5 text-gray-500 dark:text-gray-400 max-w-md truncate'>
                                    {room.description}
                                </p>
                            )}
                            <div className='flex items-center gap-3 mt-0.5'>
                                <span className='text-xs flex items-center gap-1 text-gray-500 dark:text-gray-400'>
                                    <Users size={12} />
                                    {onlineCount}/{members.length} online
                                </span>
                                <span className='text-xs text-gray-500 dark:text-gray-400'>
                                    Round {room?.roundNumber || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Room Code & Connection */}
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() =>
                                navigate(`/war-rooms/${room._id}/history`)
                            }
                            className='flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        >
                            <History size={14} />
                            History
                        </button>
                        <div
                            className='flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700/40'
                            onClick={handleCopyCode}
                        >
                            <span className='font-mono font-bold tracking-widest text-sm text-violet-700 dark:text-violet-300'>
                                {roomCode}
                            </span>
                            {copied ? (
                                <Check size={14} className='text-green-500' />
                            ) : (
                                <Copy size={14} className='text-violet-500' />
                            )}
                        </div>
                        <div
                            className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}
                            title={isConnected ? 'Connected' : 'Disconnected'}
                        />
                    </div>
                </div>

                {/* Main Layout */}
                <div
                    className='flex gap-4'
                    style={{ minHeight: 'calc(100vh - 120px)' }}
                >
                    {/* Left: Main Content */}
                    <div className='flex-1 min-w-0'>
                        {/* COUNTDOWN OVERLAY */}
                        {(countdown || generating) && (
                            <div className='flex flex-col items-center justify-center py-20'>
                                {generating ? (
                                    <>
                                        <Loader
                                            size={48}
                                            className='animate-spin mb-4 text-violet-500'
                                        />
                                        <p className='text-xl font-semibold text-gray-900 dark:text-white'>
                                            Generating Questions...
                                        </p>
                                        <p className='text-sm mt-2 text-gray-600 dark:text-gray-400'>
                                            AI is creating your quiz
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className='text-8xl font-bold mb-4 text-gray-900 dark:text-white animate-pulse'>
                                            {countdown}
                                        </div>
                                        <p className='text-xl font-semibold text-violet-600 dark:text-violet-300'>
                                            Get Ready!
                                        </p>
                                    </>
                                )}
                            </div>
                        )}

                        {/* WAITING STATE */}
                        {!countdown && !generating && (
                            <div className='space-y-5'>
                                {/* Room Info Card */}
                                <div className='p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                                    <div className='flex items-center justify-between mb-4'>
                                        <h3 className='font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200'>
                                            <Zap
                                                size={16}
                                                className='text-violet-500'
                                            />
                                            Room Info
                                        </h3>
                                    </div>
                                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                                        {[
                                            {
                                                label: 'Status',
                                                value:
                                                    room?.status === 'waiting'
                                                        ? '🟢 Waiting'
                                                        : room?.status ===
                                                            'finished'
                                                          ? '🏁 Finished'
                                                          : '⏳ In Progress',
                                            },
                                            {
                                                label: 'Visibility',
                                                value:
                                                    room?.visibility ===
                                                    'public'
                                                        ? '🌐 Public'
                                                        : '🔒 Private',
                                            },
                                            {
                                                label: 'Players',
                                                value: `${members.length}/${room?.maxPlayers || 10}`,
                                                icon: <Users size={14} />,
                                            },
                                            {
                                                label: 'Rounds Played',
                                                value: room?.roundNumber || 0,
                                                icon: <Clock size={14} />,
                                            },
                                        ].map((item) => (
                                            <div
                                                key={item.label}
                                                className='p-3 rounded-xl bg-gray-100 dark:bg-gray-700/40'
                                            >
                                                <p className='text-xs mb-1 text-gray-500 dark:text-gray-400'>
                                                    {item.label}
                                                </p>
                                                <p className='text-sm font-semibold flex items-center gap-1 text-gray-800 dark:text-gray-200'>
                                                    {item.icon}
                                                    {item.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Members */}
                                <div className='p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                                    <div className='flex items-center justify-between mb-3'>
                                        <h3 className='font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200'>
                                            <Users
                                                size={16}
                                                className='text-violet-500'
                                            />
                                            Players ({members.length}/
                                            {room?.maxPlayers || 10})
                                        </h3>
                                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                                            {readyCount} ready
                                        </span>
                                    </div>
                                    <WarRoomMemberList
                                        members={members}
                                        currentUserId={currentUserId}
                                        hostId={room?.hostId}
                                        isHost={isHost}
                                        onKick={kickPlayer}
                                        progress={{}}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className='flex gap-3'>
                                    <button
                                        onClick={handleToggleReady}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all cursor-pointer border ${
                                            isReady
                                                ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700/50 text-green-700 dark:text-green-300'
                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200'
                                        }`}
                                    >
                                        {isReady ? (
                                            <>
                                                <Check size={18} /> Ready!
                                            </>
                                        ) : (
                                            <>Click to Ready Up</>
                                        )}
                                    </button>

                                    {isHost && (
                                        <button
                                            onClick={() =>
                                                setShowStartModal(true)
                                            }
                                            className='flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all cursor-pointer bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-sm'
                                        >
                                            <Play size={18} />
                                            Start Quiz ({readyCount}/
                                            {onlineCount})
                                        </button>
                                    )}
                                </div>

                                {/* Share */}
                                <div className='flex items-center gap-3'>
                                    <button
                                        onClick={handleCopyCode}
                                        className='flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-violet-700 dark:text-violet-300'
                                    >
                                        <Share2 size={14} />
                                        Share Code: {roomCode}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Chat Panel */}
                    <div
                        className='w-80 flex-shrink-0 hidden lg:block'
                        style={{ height: 'calc(100vh - 120px)' }}
                    >
                        <WarRoomChat
                            messages={messages}
                            onSend={sendChat}
                            currentUserId={currentUserId}
                        />
                    </div>
                </div>
            </div>

            {/* Start Quiz Modal */}
            {showStartModal && (
                <StartQuizModal
                    onClose={() => setShowStartModal(false)}
                    onStart={handleStartQuiz}
                    loading={startingQuiz}
                    roomId={room?._id}
                    roomName={room?.name}
                    roomDescription={room?.description}
                />
            )}
        </div>
    );
}
