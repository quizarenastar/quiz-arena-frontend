import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Swords,
    Copy,
    Check,
    Settings,
    Play,
    Loader,
    ArrowLeft,
    Users,
    Clock,
    Zap,
    Share2,
} from 'lucide-react';
import useWarRoomSocket from '../hooks/useWarRoomSocket';
import WarRoomChat from '../Components/warroom/WarRoomChat';
import WarRoomMemberList from '../Components/warroom/WarRoomMemberList';
import WarRoomQuizView from '../Components/warroom/WarRoomQuizView';
import WarRoomResults from '../Components/warroom/WarRoomResults';
import toast from 'react-hot-toast';

export default function WarRoom() {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((s) => s.auth);
    const currentUserId = user?._id || user?.id;

    // Room state
    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [roomStatus, setRoomStatus] = useState('waiting');
    const [members, setMembers] = useState([]);
    const [settings, setSettings] = useState({});
    const [isReady, setIsReady] = useState(false);
    const [copied, setCopied] = useState(false);

    // Quiz state
    const [countdown, setCountdown] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [progress, setProgress] = useState({});
    const [results, setResults] = useState(null);

    // Settings editing
    const [editingSettings, setEditingSettings] = useState(false);
    const [settingsForm, setSettingsForm] = useState({});

    const isHost = useMemo(
        () => room?.hostId?.toString() === currentUserId,
        [room?.hostId, currentUserId]
    );

    // Socket handlers
    const handlers = useMemo(
        () => ({
            onJoined: (response) => {
                const r = response.room;
                setRoom(r);
                setMembers(r.members || []);
                setSettings(r.settings || {});
                setRoomStatus(r.status);
                setMessages(response.messages || []);

                // Restore ready state
                const me = r.members?.find(
                    (m) => m.userId?.toString() === currentUserId
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
                    prev.filter((m) => m.userId?.toString() !== userId)
                );
                if (newHostId) {
                    setRoom((prev) =>
                        prev
                            ? { ...prev, hostId: newHostId }
                            : prev
                    );
                    setMembers((prev) =>
                        prev.map((m) =>
                            m.userId?.toString() === newHostId
                                ? { ...m, role: 'host' }
                                : m
                        )
                    );
                }
            },
            onMemberReady: ({ userId, isReady: ready }) => {
                setMembers((prev) =>
                    prev.map((m) =>
                        m.userId?.toString() === userId
                            ? { ...m, isReady: ready }
                            : m
                    )
                );
            },
            onMemberKicked: (data) => {
                if (data.kicked) {
                    toast.error('You have been removed from the room');
                    navigate('/war-rooms');
                    return;
                }
                setMembers((prev) =>
                    prev.filter(
                        (m) => m.userId?.toString() !== data.userId
                    )
                );
                toast(`${data.username} was removed`);
            },
            onSettingsUpdated: ({ settings: newSettings }) => {
                setSettings(newSettings);
            },
            onCountdown: ({ seconds }) => {
                setCountdown(seconds);
                setRoomStatus('countdown');
                setGenerating(false);
            },
            onGenerating: () => {
                setGenerating(true);
                setCountdown(null);
            },
            onQuizStart: (data) => {
                setQuizData(data);
                setRoomStatus('in-progress');
                setCountdown(null);
                setGenerating(false);
                setResults(null);
                setProgress({});
            },
            onProgressUpdate: (data) => {
                setProgress((prev) => ({
                    ...prev,
                    [data.userId]: data,
                }));
            },
            onPlayerFinished: (data) => {
                toast(`${data.username} finished!`, { icon: '🏁' });
            },
            onQuizResults: (data) => {
                setResults(data);
                setRoomStatus('finished');
                setQuizData(null);
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
            },
            onDisconnected: () => {
                // Will auto-reconnect
            },
        }),
        [currentUserId, navigate]
    );

    const {
        isConnected,
        sendChat,
        toggleReady,
        startQuiz,
        submitAnswer,
        finishQuiz,
        updateSettings,
        kickPlayer,
    } = useWarRoomSocket(roomCode, handlers);

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

    const handleSaveSettings = () => {
        updateSettings(settingsForm);
        setEditingSettings(false);
    };

    const handlePlayAgain = () => {
        setResults(null);
        setRoomStatus('waiting');
        // Reset ready states
        setMembers((prev) =>
            prev.map((m) => ({ ...m, isReady: false }))
        );
        setIsReady(false);
    };

    const readyCount = members.filter((m) => m.isReady).length;
    const onlineCount = members.filter((m) => m.isOnline).length;

    // ─── MAIN RENDER ─────────────────────────────────────────

    if (!room) {
        return (
            <div
                className='min-h-screen flex items-center justify-center'
                style={{ background: '#0f0f1a' }}
            >
                <div className='text-center'>
                    <Loader
                        size={40}
                        className='animate-spin mx-auto mb-4'
                        style={{ color: '#8b5cf6' }}
                    />
                    <p style={{ color: '#94a3b8' }}>
                        {isConnected
                            ? 'Joining War Room...'
                            : 'Connecting to War Room...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className='min-h-screen'
            style={{ background: '#0f0f1a' }}
        >
            <div className='max-w-7xl mx-auto px-4 py-4'>
                {/* Top Bar */}
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={() => navigate('/war-rooms')}
                            className='p-2 rounded-lg transition-colors cursor-pointer'
                            style={{
                                background: 'rgba(30,30,50,0.6)',
                                color: '#94a3b8',
                            }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1
                                className='text-xl font-bold flex items-center gap-2'
                                style={{ color: '#f1f5f9' }}
                            >
                                <Swords
                                    size={20}
                                    style={{ color: '#8b5cf6' }}
                                />
                                {room?.name || 'War Room'}
                            </h1>
                            <div className='flex items-center gap-3 mt-0.5'>
                                <span
                                    className='text-xs flex items-center gap-1'
                                    style={{ color: '#64748b' }}
                                >
                                    <Users size={12} />
                                    {onlineCount}/{members.length} online
                                </span>
                                <span
                                    className='text-xs'
                                    style={{ color: '#64748b' }}
                                >
                                    Round{' '}
                                    {room?.roundNumber || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Room Code */}
                    <div className='flex items-center gap-2'>
                        <div
                            className='flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer'
                            style={{
                                background: 'rgba(139,92,246,0.1)',
                                border: '1px solid rgba(139,92,246,0.2)',
                            }}
                            onClick={handleCopyCode}
                        >
                            <span
                                className='font-mono font-bold tracking-widest text-sm'
                                style={{ color: '#c4b5fd' }}
                            >
                                {roomCode}
                            </span>
                            {copied ? (
                                <Check
                                    size={14}
                                    style={{ color: '#22c55e' }}
                                />
                            ) : (
                                <Copy size={14} style={{ color: '#a78bfa' }} />
                            )}
                        </div>

                        {/* Connection indicator */}
                        <div
                            className='w-3 h-3 rounded-full'
                            style={{
                                background: isConnected
                                    ? '#22c55e'
                                    : '#ef4444',
                                boxShadow: `0 0 8px ${isConnected ? '#22c55e' : '#ef4444'}`,
                            }}
                            title={
                                isConnected ? 'Connected' : 'Disconnected'
                            }
                        />
                    </div>
                </div>

                {/* Main Layout */}
                <div className='flex gap-4' style={{ minHeight: 'calc(100vh - 120px)' }}>
                    {/* Left: Main Content */}
                    <div className='flex-1 min-w-0'>
                        {/* COUNTDOWN OVERLAY */}
                        {(roomStatus === 'countdown' || generating) && (
                            <div className='flex flex-col items-center justify-center py-20'>
                                {generating ? (
                                    <>
                                        <Loader
                                            size={48}
                                            className='animate-spin mb-4'
                                            style={{ color: '#8b5cf6' }}
                                        />
                                        <p
                                            className='text-xl font-semibold'
                                            style={{ color: '#f1f5f9' }}
                                        >
                                            Generating Questions...
                                        </p>
                                        <p
                                            className='text-sm mt-2'
                                            style={{ color: '#94a3b8' }}
                                        >
                                            AI is creating your quiz
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className='text-8xl font-bold mb-4'
                                            style={{
                                                color: '#f1f5f9',
                                                animation:
                                                    'pulse 1s ease-in-out infinite',
                                                textShadow:
                                                    '0 0 40px rgba(139,92,246,0.6)',
                                            }}
                                        >
                                            {countdown}
                                        </div>
                                        <p
                                            className='text-xl font-semibold'
                                            style={{ color: '#a78bfa' }}
                                        >
                                            Get Ready!
                                        </p>
                                    </>
                                )}
                            </div>
                        )}

                        {/* WAITING / FINISHED STATE */}
                        {(roomStatus === 'waiting' ||
                            (roomStatus === 'finished' && !results)) && (
                            <div className='space-y-5'>
                                {/* Room Info Card */}
                                <div
                                    className='p-6 rounded-2xl'
                                    style={{
                                        background:
                                            'rgba(30, 30, 50, 0.4)',
                                        border: '1px solid rgba(139,92,246,0.1)',
                                    }}
                                >
                                    <div className='flex items-center justify-between mb-4'>
                                        <h3
                                            className='font-semibold flex items-center gap-2'
                                            style={{ color: '#e2e8f0' }}
                                        >
                                            <Settings
                                                size={16}
                                                style={{
                                                    color: '#a78bfa',
                                                }}
                                            />
                                            Quiz Settings
                                        </h3>
                                        {isHost && (
                                            <button
                                                onClick={() => {
                                                    setSettingsForm({
                                                        ...settings,
                                                    });
                                                    setEditingSettings(
                                                        !editingSettings
                                                    );
                                                }}
                                                className='text-xs px-3 py-1.5 rounded-lg cursor-pointer'
                                                style={{
                                                    background:
                                                        'rgba(139,92,246,0.1)',
                                                    color: '#a78bfa',
                                                    border: '1px solid rgba(139,92,246,0.2)',
                                                }}
                                            >
                                                {editingSettings
                                                    ? 'Cancel'
                                                    : 'Edit'}
                                            </button>
                                        )}
                                    </div>

                                    {editingSettings ? (
                                        <div className='space-y-3'>
                                            <div className='grid grid-cols-2 gap-3'>
                                                <div>
                                                    <label className='text-xs block mb-1' style={{color:'#94a3b8'}}>Topic</label>
                                                    <input
                                                        type='text'
                                                        value={settingsForm.topic || ''}
                                                        onChange={(e) => setSettingsForm({...settingsForm, topic: e.target.value})}
                                                        className='w-full px-3 py-2 rounded-lg text-sm outline-none'
                                                        style={{background:'rgba(15,15,25,0.8)', border:'1px solid rgba(139,92,246,0.2)', color:'#f1f5f9'}}
                                                    />
                                                </div>
                                                <div>
                                                    <label className='text-xs block mb-1' style={{color:'#94a3b8'}}>Difficulty</label>
                                                    <select
                                                        value={settingsForm.difficulty || 'medium'}
                                                        onChange={(e) => setSettingsForm({...settingsForm, difficulty: e.target.value})}
                                                        className='w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer'
                                                        style={{background:'rgba(15,15,25,0.8)', border:'1px solid rgba(139,92,246,0.2)', color:'#f1f5f9'}}
                                                    >
                                                        <option value='easy'>Easy</option>
                                                        <option value='medium'>Medium</option>
                                                        <option value='hard'>Hard</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className='text-xs block mb-1' style={{color:'#94a3b8'}}>Questions: {settingsForm.totalQuestions}</label>
                                                    <input type='range' min={5} max={30} step={5} value={settingsForm.totalQuestions || 10} onChange={(e) => setSettingsForm({...settingsForm, totalQuestions: parseInt(e.target.value)})} className='w-full accent-purple-500' />
                                                </div>
                                                <div>
                                                    <label className='text-xs block mb-1' style={{color:'#94a3b8'}}>Time/Q: {settingsForm.timePerQuestion}s</label>
                                                    <input type='range' min={10} max={120} step={5} value={settingsForm.timePerQuestion || 30} onChange={(e) => setSettingsForm({...settingsForm, timePerQuestion: parseInt(e.target.value)})} className='w-full accent-purple-500' />
                                                </div>
                                            </div>
                                            <button onClick={handleSaveSettings} className='px-4 py-2 rounded-lg text-sm font-medium cursor-pointer' style={{background:'linear-gradient(135deg, #8b5cf6, #6d28d9)', color:'#fff'}}>
                                                Save Settings
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                                            {[
                                                { label: 'Topic', value: settings.topic || 'General Knowledge', icon: <Zap size={14} /> },
                                                { label: 'Difficulty', value: (settings.difficulty || 'medium').charAt(0).toUpperCase() + (settings.difficulty || 'medium').slice(1) },
                                                { label: 'Questions', value: settings.totalQuestions || 10 },
                                                { label: 'Time/Q', value: `${settings.timePerQuestion || 30}s`, icon: <Clock size={14} /> },
                                            ].map((item) => (
                                                <div
                                                    key={item.label}
                                                    className='p-3 rounded-xl'
                                                    style={{
                                                        background: 'rgba(15,15,25,0.6)',
                                                    }}
                                                >
                                                    <p className='text-xs mb-1' style={{ color: '#64748b' }}>{item.label}</p>
                                                    <p className='text-sm font-semibold flex items-center gap-1' style={{ color: '#e2e8f0' }}>
                                                        {item.icon}
                                                        {item.value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Members */}
                                <div
                                    className='p-5 rounded-2xl'
                                    style={{
                                        background: 'rgba(30,30,50,0.4)',
                                        border: '1px solid rgba(139,92,246,0.1)',
                                    }}
                                >
                                    <div className='flex items-center justify-between mb-3'>
                                        <h3 className='font-semibold flex items-center gap-2' style={{ color: '#e2e8f0' }}>
                                            <Users size={16} style={{ color: '#a78bfa' }} />
                                            Players ({members.length}/{room?.maxPlayers || 10})
                                        </h3>
                                        <span className='text-xs' style={{ color: '#64748b' }}>
                                            {readyCount} ready
                                        </span>
                                    </div>
                                    <WarRoomMemberList
                                        members={members}
                                        currentUserId={currentUserId}
                                        hostId={room?.hostId}
                                        isHost={isHost}
                                        onKick={kickPlayer}
                                        progress={progress}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className='flex gap-3'>
                                    <button
                                        onClick={handleToggleReady}
                                        className='flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all cursor-pointer'
                                        style={{
                                            background: isReady
                                                ? 'rgba(34,197,94,0.15)'
                                                : 'rgba(30,30,50,0.6)',
                                            border: `1px solid ${isReady ? 'rgba(34,197,94,0.4)' : 'rgba(139,92,246,0.2)'}`,
                                            color: isReady ? '#4ade80' : '#e2e8f0',
                                        }}
                                    >
                                        {isReady ? (
                                            <><Check size={18} /> Ready!</>
                                        ) : (
                                            <>Click to Ready Up</>
                                        )}
                                    </button>

                                    {isHost && (
                                        <button
                                            onClick={startQuiz}
                                            disabled={onlineCount < 2}
                                            className='flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
                                            style={{
                                                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                                                boxShadow: '0 4px 15px rgba(139,92,246,0.4)',
                                            }}
                                        >
                                            <Play size={18} />
                                            Start Quiz ({readyCount}/{onlineCount})
                                        </button>
                                    )}
                                </div>

                                {/* Share */}
                                <div className='flex items-center gap-3'>
                                    <button
                                        onClick={handleCopyCode}
                                        className='flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm cursor-pointer'
                                        style={{
                                            background: 'rgba(30,30,50,0.6)',
                                            border: '1px solid rgba(139,92,246,0.15)',
                                            color: '#a78bfa',
                                        }}
                                    >
                                        <Share2 size={14} />
                                        Share Code: {roomCode}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* IN-PROGRESS STATE */}
                        {roomStatus === 'in-progress' && quizData && (
                            <WarRoomQuizView
                                questions={quizData.questions}
                                duration={quizData.duration}
                                quizId={quizData.quizId}
                                startedAt={quizData.startedAt}
                                onSubmitAnswer={submitAnswer}
                                onFinish={finishQuiz}
                            />
                        )}

                        {/* RESULTS STATE */}
                        {roomStatus === 'finished' && results && (
                            <WarRoomResults
                                results={results.results}
                                roundNumber={results.roundNumber}
                                currentUserId={currentUserId}
                                isHost={isHost}
                                questions={results.questions}
                                onPlayAgain={handlePlayAgain}
                                onBackToLobby={() => navigate('/war-rooms')}
                            />
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

            {/* Pulse animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
}
