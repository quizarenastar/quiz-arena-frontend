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
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all border ${
                            isMe
                                ? 'bg-violet-100 dark:bg-violet-900/30 border-violet-200 dark:border-violet-700/40'
                                : 'bg-gray-100 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        {/* Avatar */}
                        <div className='relative'>
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white ${
                                    isMemberHost
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                                        : 'bg-gradient-to-r from-blue-500 to-blue-700'
                                }`}
                            >
                                {member.profilePicture ? (
                                    <img
                                        src={member.profilePicture}
                                        alt=''
                                        className='w-full h-full rounded-full object-cover'
                                    />
                                ) : (
                                    member.username?.charAt(0)?.toUpperCase() ||
                                    '?'
                                )}
                            </div>
                            {/* Online indicator */}
                            <div
                                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
                                    member.isOnline
                                        ? 'bg-green-500'
                                        : 'bg-gray-500'
                                } border-white dark:border-gray-800`}
                            />
                        </div>

                        {/* Info */}
                        <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-1.5'>
                                <span
                                    className={`text-sm font-medium truncate ${isMe ? 'text-violet-700 dark:text-violet-300' : 'text-gray-800 dark:text-gray-200'}`}
                                >
                                    {member.username}
                                    {isMe && (
                                        <span className='text-xs ml-1 text-violet-600 dark:text-violet-300'>
                                            (You)
                                        </span>
                                    )}
                                </span>
                                {isMemberHost && (
                                    <Crown
                                        size={14}
                                        className='text-amber-500'
                                    />
                                )}
                            </div>
                            <div className='flex items-center gap-2 mt-0.5'>
                                {member.isOnline ? (
                                    <Wifi
                                        size={10}
                                        className='text-green-500'
                                    />
                                ) : (
                                    <WifiOff
                                        size={10}
                                        className='text-gray-500'
                                    />
                                )}
                                <span
                                    className={`text-xs ${member.isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}
                                >
                                    {member.isOnline ? 'Online' : 'Offline'}
                                </span>
                                {memberProgress && (
                                    <span className='text-xs ml-auto text-violet-600 dark:text-violet-300'>
                                        {memberProgress.answeredCount}/
                                        {memberProgress.totalQuestions}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Ready status or Kick */}
                        <div className='flex items-center gap-2'>
                            {member.isReady && (
                                <div className='p-1 rounded-full bg-green-100 dark:bg-green-900/30'>
                                    <Check
                                        size={14}
                                        className='text-green-500'
                                    />
                                </div>
                            )}
                            {isHost && !isMe && !isMemberHost && (
                                <button
                                    onClick={() => onKick?.(member.userId)}
                                    className='p-1.5 rounded-lg transition-all cursor-pointer text-gray-500 dark:text-gray-400 hover:text-red-500'
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
