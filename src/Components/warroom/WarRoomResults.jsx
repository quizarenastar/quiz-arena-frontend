import { Trophy, Medal, Star, RotateCcw, ArrowLeft } from 'lucide-react';

const PODIUM_COLORS = [
    { bg: 'bg-gradient-to-r from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30', emoji: '🥇' },
    { bg: 'bg-gradient-to-r from-slate-400 to-slate-600', shadow: 'shadow-slate-500/30', emoji: '🥈' },
    { bg: 'bg-gradient-to-r from-orange-700 to-amber-900', shadow: 'shadow-orange-700/30', emoji: '🥉' },
];

export default function WarRoomResults({
    results,
    roundNumber,
    currentUserId,
    isHost,
    onPlayAgain,
    onBackToLobby,
    questions,
}) {
    if (!results || results.length === 0) return null;

    const topThree = results.slice(0, 3);
    const myResult = results.find(
        (r) => r.userId?.toString() === currentUserId
    );

    return (
        <div className='max-w-3xl mx-auto py-4'>
            {/* Header */}
            <div className='text-center mb-8'>
                <div className='text-5xl mb-3'>🏆</div>
                <h2 className='text-2xl font-bold mb-1 text-gray-900 dark:text-white'>
                    Round {roundNumber} Results
                </h2>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {results[0]?.username} wins this round!
                </p>
            </div>

            {/* Podium */}
            <div className='flex items-end justify-center gap-4 mb-8'>
                {/* Rearrange for podium: 2nd, 1st, 3rd */}
                {[topThree[1], topThree[0], topThree[2]]
                    .filter(Boolean)
                    .map((player, displayIdx) => {
                        const actualRank = player.rank;
                        const podiumConfig =
                            PODIUM_COLORS[actualRank - 1] || PODIUM_COLORS[2];
                        const isFirst = actualRank === 1;
                        const isMe =
                            player.userId?.toString() === currentUserId;
                        const heights = { 1: 160, 2: 120, 3: 90 };

                        return (
                            <div
                                key={player.userId}
                                className='flex flex-col items-center'
                                style={{
                                    animation: `slideUp 0.6s ease-out ${displayIdx * 0.15}s both`,
                                }}
                            >
                                {/* Avatar */}
                                <div className='relative mb-2'>
                                    <div
                                        className={`rounded-full flex items-center justify-center font-bold text-white shadow-lg ${podiumConfig.bg} ${podiumConfig.shadow} ${isMe ? 'ring-2 ring-violet-500' : ''}`}
                                        style={{
                                            width: isFirst ? 64 : 52,
                                            height: isFirst ? 64 : 52,
                                            fontSize: isFirst ? 22 : 18,
                                        }}
                                    >
                                        {player.profilePicture ? (
                                            <img
                                                src={player.profilePicture}
                                                alt=''
                                                className='w-full h-full rounded-full object-cover'
                                            />
                                        ) : (
                                            player.username
                                                ?.charAt(0)
                                                ?.toUpperCase()
                                        )}
                                    </div>
                                    <span className='absolute -top-2 -right-2 text-lg'>
                                        {podiumConfig.emoji}
                                    </span>
                                </div>

                                {/* Name */}
                                <span className={`text-sm font-semibold mb-1 truncate max-w-[90px] text-center ${isMe ? 'text-violet-700 dark:text-violet-300' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {player.username}
                                </span>

                                {/* Score */}
                                <span className='text-xs font-medium mb-2 text-violet-600 dark:text-violet-300'>
                                    {player.score} pts
                                </span>

                                {/* Podium bar */}
                                <div
                                    className={`rounded-t-xl flex items-center justify-center ${podiumConfig.bg}`}
                                    style={{
                                        width: isFirst ? 100 : 80,
                                        height: heights[actualRank] || 80,
                                        opacity: 0.8,
                                    }}
                                >
                                    <span className='text-2xl font-bold text-white/90'>
                                        #{actualRank}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* My result highlight */}
            {myResult && myResult.rank > 3 && (
                <div className='p-4 rounded-xl mb-6 text-center bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700/40'>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Your Position
                    </p>
                    <p className='text-2xl font-bold text-violet-700 dark:text-violet-300'>
                        #{myResult.rank}
                    </p>
                    <p className='text-sm text-violet-600 dark:text-violet-300'>
                        {myResult.score} points •{' '}
                        {myResult.correctAnswers}/{results[0]?.correctAnswers > 0 ? questions?.length || '?' : '?'} correct •{' '}
                        {Math.round(myResult.percentage)}%
                    </p>
                </div>
            )}

            {/* Full Results Table */}
            <div className='rounded-xl overflow-hidden mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <div className='px-4 py-3 bg-gray-50 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-700'>
                    <h3 className='text-sm font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200'>
                        <Medal size={16} className='text-violet-500' />
                        Full Leaderboard
                    </h3>
                </div>
                <div className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {results.map((player) => {
                        const isMe =
                            player.userId?.toString() === currentUserId;

                        return (
                            <div
                                key={player.userId}
                                className={`flex items-center gap-3 px-4 py-3 ${isMe ? 'bg-violet-50 dark:bg-violet-900/20' : ''}`}
                            >
                                <span className={`w-8 text-center font-bold text-sm ${player.rank <= 3 ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                    #{player.rank}
                                </span>
                                <div className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-700 text-white'>
                                    {player.profilePicture ? (
                                        <img
                                            src={player.profilePicture}
                                            alt=''
                                            className='w-full h-full rounded-full object-cover'
                                        />
                                    ) : (
                                        player.username?.charAt(0)?.toUpperCase()
                                    )}
                                </div>
                                <span className={`flex-1 text-sm font-medium ${isMe ? 'text-violet-700 dark:text-violet-300' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {player.username}{' '}
                                    {isMe && (
                                        <span className='text-violet-600 dark:text-violet-300'>
                                            (You)
                                        </span>
                                    )}
                                </span>
                                <span className='text-sm font-medium text-green-600 dark:text-green-400'>
                                    {player.correctAnswers} correct
                                </span>
                                <span className='text-sm font-bold min-w-[60px] text-right text-violet-600 dark:text-violet-300'>
                                    {player.score} pts
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3'>
                <button
                    onClick={onBackToLobby}
                    className='flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                    <ArrowLeft size={18} />
                    Back to Lobby
                </button>
                {isHost && (
                    <button
                        onClick={onPlayAgain}
                        className='flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all cursor-pointer bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-sm'
                    >
                        <RotateCcw size={18} />
                        Play Again
                    </button>
                )}
            </div>

            {/* Slide-up animation */}
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
