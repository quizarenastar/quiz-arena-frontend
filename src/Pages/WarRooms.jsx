import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Swords,
    Plus,
    Search,
    Users,
    Globe,
    Lock,
    Hash,
    ArrowRight,
    Loader,
    LogIn,
} from 'lucide-react';
import WarRoomService from '../service/WarRoomService';
import CreateWarRoomModal from '../Components/warroom/CreateWarRoomModal';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
    waiting: { bg: 'rgba(34,197,94,0.12)', color: '#4ade80', label: 'Waiting' },
    finished: { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', label: 'Between Rounds' },
    'in-progress': { bg: 'rgba(249,115,22,0.12)', color: '#fb923c', label: 'In Game' },
    countdown: { bg: 'rgba(234,179,8,0.12)', color: '#facc15', label: 'Starting' },
    closed: { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8', label: 'Closed' },
};

export default function WarRooms() {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((s) => s.auth);
    const [activeTab, setActiveTab] = useState('public');
    const [publicRooms, setPublicRooms] = useState([]);
    const [myRooms, setMyRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        if (isAuthenticated) loadRooms();
    }, [isAuthenticated]);

    const loadRooms = async () => {
        setLoading(true);
        try {
            const [pubRes, myRes] = await Promise.all([
                WarRoomService.getPublicRooms(),
                WarRoomService.getMyRooms(),
            ]);
            setPublicRooms(pubRes.data || []);
            setMyRooms(myRes.data || []);
        } catch (err) {
            toast.error(err.message || 'Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (roomData) => {
        setCreating(true);
        try {
            const res = await WarRoomService.createRoom(roomData);
            toast.success('War Room created!');
            setShowCreate(false);
            navigate(`/war-rooms/${res.data.roomCode}`);
        } catch (err) {
            toast.error(err.message || 'Failed to create room');
        } finally {
            setCreating(false);
        }
    };

    const handleJoinByCode = async (e) => {
        e.preventDefault();
        if (!joinCode.trim()) return;
        setJoining(true);
        try {
            await WarRoomService.joinRoom(joinCode.trim().toUpperCase());
            toast.success('Joined room!');
            navigate(`/war-rooms/${joinCode.trim().toUpperCase()}`);
        } catch (err) {
            toast.error(err.message || 'Failed to join room');
        } finally {
            setJoining(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div
                className='min-h-screen flex items-center justify-center'
                style={{ background: '#0f0f1a' }}
            >
                <div className='text-center'>
                    <Swords
                        size={48}
                        style={{ color: '#8b5cf6', margin: '0 auto 16px' }}
                    />
                    <h2
                        className='text-2xl font-bold mb-2'
                        style={{ color: '#f1f5f9' }}
                    >
                        War Room
                    </h2>
                    <p className='mb-6' style={{ color: '#94a3b8' }}>
                        Log in to create or join a War Room
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className='px-6 py-3 rounded-xl font-semibold text-white cursor-pointer'
                        style={{
                            background:
                                'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                        }}
                    >
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    const rooms = activeTab === 'public' ? publicRooms : myRooms;

    return (
        <div
            className='min-h-screen'
            style={{ background: '#0f0f1a' }}
        >
            <div className='max-w-6xl mx-auto px-4 py-8'>
                {/* Hero */}
                <div className='text-center mb-10'>
                    <div
                        className='inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4'
                        style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139,92,246,0.2)',
                        }}
                    >
                        <Swords size={16} style={{ color: '#a78bfa' }} />
                        <span
                            className='text-sm font-medium'
                            style={{ color: '#a78bfa' }}
                        >
                            Multiplayer Quiz Arena
                        </span>
                    </div>
                    <h1
                        className='text-4xl font-bold mb-3'
                        style={{
                            background:
                                'linear-gradient(135deg, #c4b5fd, #8b5cf6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        War Room
                    </h1>
                    <p
                        className='text-lg max-w-xl mx-auto'
                        style={{ color: '#94a3b8' }}
                    >
                        Challenge your friends in real-time quiz battles.
                        Create a room, invite friends, and compete!
                    </p>
                </div>

                {/* Actions Bar */}
                <div className='flex flex-col sm:flex-row gap-4 mb-8'>
                    {/* Create button */}
                    <button
                        onClick={() => setShowCreate(true)}
                        className='flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all cursor-pointer'
                        style={{
                            background:
                                'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                            boxShadow:
                                '0 4px 20px rgba(139, 92, 246, 0.4)',
                        }}
                        onMouseEnter={(e) =>
                            (e.target.style.boxShadow =
                                '0 6px 30px rgba(139, 92, 246, 0.6)')
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.boxShadow =
                                '0 4px 20px rgba(139, 92, 246, 0.4)')
                        }
                    >
                        <Plus size={20} />
                        Create War Room
                    </button>

                    {/* Join by code */}
                    <form
                        onSubmit={handleJoinByCode}
                        className='flex gap-2 flex-1'
                    >
                        <div className='relative flex-1'>
                            <Hash
                                size={16}
                                className='absolute left-3 top-1/2 -translate-y-1/2'
                                style={{ color: '#64748b' }}
                            />
                            <input
                                type='text'
                                value={joinCode}
                                onChange={(e) =>
                                    setJoinCode(
                                        e.target.value.toUpperCase().slice(0, 6)
                                    )
                                }
                                placeholder='Enter room code'
                                maxLength={6}
                                className='w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none font-mono tracking-widest'
                                style={{
                                    background: 'rgba(30, 30, 50, 0.6)',
                                    border: '1px solid rgba(139,92,246,0.2)',
                                    color: '#f1f5f9',
                                }}
                                onFocus={(e) =>
                                    (e.target.style.borderColor =
                                        'rgba(139,92,246,0.5)')
                                }
                                onBlur={(e) =>
                                    (e.target.style.borderColor =
                                        'rgba(139,92,246,0.2)')
                                }
                            />
                        </div>
                        <button
                            type='submit'
                            disabled={joinCode.length !== 6 || joining}
                            className='flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
                            style={{
                                background: 'rgba(59, 130, 246, 0.15)',
                                border: '1px solid rgba(59,130,246,0.3)',
                                color: '#60a5fa',
                            }}
                        >
                            <LogIn size={16} />
                            Join
                        </button>
                    </form>
                </div>

                {/* Tabs */}
                <div
                    className='flex gap-1 mb-6 p-1 rounded-xl w-fit'
                    style={{ background: 'rgba(30, 30, 50, 0.6)' }}
                >
                    {['public', 'my-rooms'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() =>
                                setActiveTab(
                                    tab === 'my-rooms' ? 'my-rooms' : 'public'
                                )
                            }
                            className='px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer'
                            style={{
                                background:
                                    activeTab === tab
                                        ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                                        : 'transparent',
                                color:
                                    activeTab === tab
                                        ? '#fff'
                                        : '#94a3b8',
                            }}
                        >
                            {tab === 'public'
                                ? `Public Rooms (${publicRooms.length})`
                                : `My Rooms (${myRooms.length})`}
                        </button>
                    ))}
                </div>

                {/* Room List */}
                {loading ? (
                    <div className='flex justify-center py-20'>
                        <Loader
                            size={32}
                            className='animate-spin'
                            style={{ color: '#8b5cf6' }}
                        />
                    </div>
                ) : rooms.length === 0 ? (
                    <div className='text-center py-20'>
                        <Swords
                            size={48}
                            style={{
                                color: '#334155',
                                margin: '0 auto 16px',
                            }}
                        />
                        <p
                            className='text-lg font-medium mb-2'
                            style={{ color: '#64748b' }}
                        >
                            {activeTab === 'public'
                                ? 'No public rooms available'
                                : 'You haven\'t joined any rooms yet'}
                        </p>
                        <p style={{ color: '#475569' }}>
                            Create a room or join one with a code!
                        </p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {rooms.map((room) => {
                            const statusStyle =
                                STATUS_STYLES[room.status] ||
                                STATUS_STYLES.closed;

                            return (
                                <div
                                    key={room._id}
                                    onClick={() =>
                                        navigate(
                                            `/war-rooms/${room.roomCode}`
                                        )
                                    }
                                    className='p-5 rounded-2xl transition-all cursor-pointer group'
                                    style={{
                                        background:
                                            'rgba(30, 30, 50, 0.4)',
                                        border: '1px solid rgba(139,92,246,0.1)',
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.borderColor =
                                            'rgba(139,92,246,0.3)')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.borderColor =
                                            'rgba(139,92,246,0.1)')
                                    }
                                >
                                    {/* Top row */}
                                    <div className='flex items-start justify-between mb-3'>
                                        <div className='flex-1 min-w-0'>
                                            <h3
                                                className='font-semibold text-lg truncate mb-1'
                                                style={{
                                                    color: '#f1f5f9',
                                                }}
                                            >
                                                {room.name}
                                            </h3>
                                            <div className='flex items-center gap-2'>
                                                <span
                                                    className='text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1'
                                                    style={{
                                                        background:
                                                            statusStyle.bg,
                                                        color: statusStyle.color,
                                                    }}
                                                >
                                                    {statusStyle.label}
                                                </span>
                                                {room.visibility ===
                                                'private' ? (
                                                    <Lock
                                                        size={12}
                                                        style={{
                                                            color: '#64748b',
                                                        }}
                                                    />
                                                ) : (
                                                    <Globe
                                                        size={12}
                                                        style={{
                                                            color: '#64748b',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <span
                                            className='font-mono text-xs px-2 py-1 rounded-lg'
                                            style={{
                                                background:
                                                    'rgba(139,92,246,0.1)',
                                                color: '#a78bfa',
                                            }}
                                        >
                                            {room.roomCode}
                                        </span>
                                    </div>

                                    {/* Info row */}
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-4'>
                                            <div className='flex items-center gap-1.5'>
                                                <Users
                                                    size={14}
                                                    style={{
                                                        color: '#64748b',
                                                    }}
                                                />
                                                <span
                                                    className='text-sm'
                                                    style={{
                                                        color: '#94a3b8',
                                                    }}
                                                >
                                                    {room.members?.length ||
                                                        0}
                                                    /{room.maxPlayers}
                                                </span>
                                            </div>
                                            {room.settings?.topic && (
                                                <span
                                                    className='text-xs truncate max-w-[120px]'
                                                    style={{
                                                        color: '#64748b',
                                                    }}
                                                >
                                                    {room.settings.topic}
                                                </span>
                                            )}
                                        </div>
                                        <ArrowRight
                                            size={18}
                                            className='transition-transform group-hover:translate-x-1'
                                            style={{ color: '#8b5cf6' }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreate && (
                <CreateWarRoomModal
                    onClose={() => setShowCreate(false)}
                    onSubmit={handleCreate}
                    loading={creating}
                />
            )}
        </div>
    );
}
