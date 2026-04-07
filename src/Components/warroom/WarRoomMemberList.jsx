import { Crown, Wifi, WifiOff, UserX, Check, Loader } from 'lucide-react';

export default function WarRoomMemberList({
    members,
    currentUserId,
    hostId,
    isHost,
    onKick,
    progress,
}) {
    return (
        <div className='space-y-2'>
            {members.map((member) => {
                const isMe = member.userId?.toString() === currentUserId;
                const isMemberHost =
                    member.role === 'host' ||
                    member.userId?.toString() === hostId?.toString();
                const memberProgress = progress?.[member.userId?.toString()];

                return (
                    <div
                        key={member.userId}
                        className='flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all'
                        style={{
                            background: isMe
                                ? 'rgba(139, 92, 246, 0.1)'
                                : 'rgba(30, 30, 50, 0.4)',
                            border: `1px solid ${isMe ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255,255,255,0.03)'}`,
                        }}
                    >
                        {/* Avatar */}
                        <div className='relative'>
                            <div
                                className='w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0'
                                style={{
                                    background: isMemberHost
                                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                    color: '#fff',
                                }}
                            >
                                {member.profilePicture ? (
                                    <img
                                        src={member.profilePicture}
                                        alt=''
                                        className='w-full h-full rounded-full object-cover'
                                    />
                                ) : (
                                    member.username
                                        ?.charAt(0)
                                        ?.toUpperCase() || '?'
                                )}
                            </div>
                            {/* Online indicator */}
                            <div
                                className='absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2'
                                style={{
                                    background: member.isOnline
                                        ? '#22c55e'
                                        : '#64748b',
                                    borderColor: '#1e1e2e',
                                }}
                            />
                        </div>

                        {/* Info */}
                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-1.5'>
                                <span
                                    className='text-sm font-medium truncate'
                                    style={{
                                        color: isMe ? '#c4b5fd' : '#e2e8f0',
                                    }}
                                >
                                    {member.username}
                                    {isMe && (
                                        <span
                                            className='text-xs ml-1'
                                            style={{ color: '#8b5cf6' }}
                                        >
                                            (You)
                                        </span>
                                    )}
                                </span>
                                {isMemberHost && (
                                    <Crown
                                        size={14}
                                        style={{ color: '#f59e0b' }}
                                    />
                                )}
                            </div>
                            <div className='flex items-center gap-2 mt-0.5'>
                                {member.isOnline ? (
                                    <Wifi
                                        size={10}
                                        style={{ color: '#22c55e' }}
                                    />
                                ) : (
                                    <WifiOff
                                        size={10}
                                        style={{ color: '#64748b' }}
                                    />
                                )}
                                <span
                                    className='text-xs'
                                    style={{
                                        color: member.isOnline
                                            ? '#22c55e'
                                            : '#64748b',
                                    }}
                                >
                                    {member.isOnline ? 'Online' : 'Offline'}
                                </span>
                                {memberProgress && (
                                    <span
                                        className='text-xs ml-auto'
                                        style={{ color: '#a78bfa' }}
                                    >
                                        {memberProgress.answeredCount}/
                                        {memberProgress.totalQuestions}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Ready status or Kick */}
                        <div className='flex items-center gap-2'>
                            {member.isReady && (
                                <div
                                    className='p-1 rounded-full'
                                    style={{
                                        background:
                                            'rgba(34, 197, 94, 0.15)',
                                    }}
                                >
                                    <Check
                                        size={14}
                                        style={{ color: '#22c55e' }}
                                    />
                                </div>
                            )}
                            {isHost && !isMe && !isMemberHost && (
                                <button
                                    onClick={() => onKick?.(member.userId)}
                                    className='p-1.5 rounded-lg transition-all cursor-pointer'
                                    style={{ color: '#64748b' }}
                                    onMouseEnter={(e) =>
                                        (e.target.style.color = '#f87171')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.target.style.color = '#64748b')
                                    }
                                    title='Kick player'
                                >
                                    <UserX size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
