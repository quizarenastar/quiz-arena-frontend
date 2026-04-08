import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Swords,
    Plus,
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
    waiting: {
        badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        label: 'Waiting',
    },
    finished: {
        badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        label: 'Between Rounds',
    },
    'in-progress': {
        badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
        label: 'In Game',
    },
    countdown: {
        badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
        label: 'Starting',
    },
    closed: {
        badge: 'bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300',
        label: 'Closed',
    },
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
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <Swords size={48} className='mx-auto mb-4 text-violet-500' />
                    <h2 className='text-2xl font-bold mb-2 text-gray-900 dark:text-white'>
                        War Room
                    </h2>
                    <p className='mb-6 text-gray-600 dark:text-gray-400'>
                        Log in to create or join a War Room
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className='px-6 py-3 rounded-xl font-semibold text-white cursor-pointer bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 transition-colors'
                    >
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    const rooms = activeTab === 'public' ? publicRooms : myRooms;

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='max-w-6xl mx-auto px-4 py-8'>
                {/* Hero */}
                <div className='text-center mb-10'>
                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700/40'>
                        <Swords size={16} className='text-violet-500 dark:text-violet-300' />
                        <span className='text-sm font-medium text-violet-600 dark:text-violet-300'>
                            Multiplayer Quiz Arena
                        </span>
                    </div>
                    <h1 className='text-4xl font-bold mb-3 bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent'>
                        War Room
                    </h1>
                    <p className='text-lg max-w-xl mx-auto text-gray-600 dark:text-gray-400'>
                        Challenge your friends in real-time quiz battles.
                        Create a room, invite friends, and compete!
                    </p>
                </div>

                {/* Actions Bar */}
                <div className='flex flex-col sm:flex-row gap-4 mb-8'>
                    {/* Create button */}
                    <button
                        onClick={() => setShowCreate(true)}
                        className='flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all cursor-pointer bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/30'
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
                                className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500'
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
                                className='w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none font-mono tracking-widest border border-violet-200 dark:border-violet-700/40 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent'
                            />
                        </div>
                        <button
                            type='submit'
                            disabled={joinCode.length !== 6 || joining}
                            className='flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/40 text-blue-700 dark:text-blue-300'
                        >
                            <LogIn size={16} />
                            Join
                        </button>
                    </form>
                </div>

                {/* Tabs */}
                <div className='flex gap-1 mb-6 p-1 rounded-xl w-fit bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                    {['public', 'my-rooms'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() =>
                                setActiveTab(
                                    tab === 'my-rooms' ? 'my-rooms' : 'public'
                                )
                            }
                            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                activeTab === tab
                                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
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
                        <Loader size={32} className='animate-spin text-violet-500' />
                    </div>
                ) : rooms.length === 0 ? (
                    <div className='text-center py-20'>
                        <Swords size={48} className='mx-auto mb-4 text-gray-300 dark:text-gray-600' />
                        <p className='text-lg font-medium mb-2 text-gray-600 dark:text-gray-400'>
                            {activeTab === 'public'
                                ? 'No public rooms available'
                                : 'You haven\'t joined any rooms yet'}
                        </p>
                        <p className='text-gray-500 dark:text-gray-500'>
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
                                    className='p-5 rounded-2xl transition-all cursor-pointer group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600/50 shadow-sm hover:shadow-md'
                                >
                                    {/* Top row */}
                                    <div className='flex items-start justify-between mb-3'>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-semibold text-lg truncate mb-1 text-gray-900 dark:text-white'>
                                                {room.name}
                                            </h3>
                                            {room.description && (
                                                <p className='text-xs mb-2 line-clamp-2 text-gray-500 dark:text-gray-400'>
                                                    {room.description}
                                                </p>
                                            )}
                                            <div className='flex items-center gap-2'>
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${statusStyle.badge}`}
                                                >
                                                    {statusStyle.label}
                                                </span>
                                                {room.visibility ===
                                                'private' ? (
                                                    <Lock
                                                        size={12}
                                                        className='text-gray-400 dark:text-gray-500'
                                                    />
                                                ) : (
                                                    <Globe
                                                        size={12}
                                                        className='text-gray-400 dark:text-gray-500'
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <span className='font-mono text-xs px-2 py-1 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'>
                                            {room.roomCode}
                                        </span>
                                    </div>

                                    {/* Info row */}
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-4'>
                                            <div className='flex items-center gap-1.5'>
                                                <Users size={14} className='text-gray-400 dark:text-gray-500' />
                                                <span className='text-sm text-gray-600 dark:text-gray-400'>
                                                    {room.members?.length ||
                                                        0}
                                                    /{room.maxPlayers}
                                                </span>
                                            </div>
                                            {room.settings?.topic && (
                                                <span className='text-xs truncate max-w-[120px] text-gray-500 dark:text-gray-500'>
                                                    {room.settings.topic}
                                                </span>
                                            )}
                                        </div>
                                        <ArrowRight
                                            size={18}
                                            className='transition-transform group-hover:translate-x-1 text-violet-500'
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
