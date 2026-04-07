import { Trophy, Medal, Star, RotateCcw, ArrowLeft } from 'lucide-react';

const PODIUM_COLORS = [
    { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: 'rgba(245,158,11,0.4)', emoji: '🥇' },
    { bg: 'linear-gradient(135deg, #94a3b8, #64748b)', shadow: 'rgba(148,163,184,0.4)', emoji: '🥈' },
    { bg: 'linear-gradient(135deg, #cd7f32, #a0522d)', shadow: 'rgba(205,127,50,0.4)', emoji: '🥉' },
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
    const rest = results.slice(3);
    const myResult = results.find(
        (r) => r.userId?.toString() === currentUserId
    );

    return (
        <div className='max-w-3xl mx-auto py-4'>
            {/* Header */}
            <div className='text-center mb-8'>
                <div className='text-5xl mb-3'>🏆</div>
                <h2
                    className='text-2xl font-bold mb-1'
                    style={{ color: '#f1f5f9' }}
                >
                    Round {roundNumber} Results
                </h2>
                <p className='text-sm' style={{ color: '#94a3b8' }}>
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
                                        className='rounded-full flex items-center justify-center font-bold'
                                        style={{
                                            width: isFirst ? 64 : 52,
                                            height: isFirst ? 64 : 52,
                                            background: podiumConfig.bg,
                                            boxShadow: `0 4px 20px ${podiumConfig.shadow}`,
                                            color: '#fff',
                                            fontSize: isFirst ? 22 : 18,
                                            border: isMe
                                                ? '3px solid #8b5cf6'
                                                : 'none',
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
                                <span
                                    className='text-sm font-semibold mb-1 truncate max-w-[90px] text-center'
                                    style={{
                                        color: isMe ? '#c4b5fd' : '#e2e8f0',
                                    }}
                                >
                                    {player.username}
                                </span>

                                {/* Score */}
                                <span
                                    className='text-xs font-medium mb-2'
                                    style={{ color: '#a78bfa' }}
                                >
                                    {player.score} pts
                                </span>

                                {/* Podium bar */}
                                <div
                                    className='rounded-t-xl flex items-center justify-center'
                                    style={{
                                        width: isFirst ? 100 : 80,
                                        height: heights[actualRank] || 80,
                                        background: podiumConfig.bg,
                                        opacity: 0.8,
                                    }}
                                >
                                    <span
                                        className='text-2xl font-bold'
                                        style={{ color: 'rgba(255,255,255,0.9)' }}
                                    >
                                        #{actualRank}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* My result highlight */}
            {myResult && myResult.rank > 3 && (
                <div
                    className='p-4 rounded-xl mb-6 text-center'
                    style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                    }}
                >
                    <p className='text-sm' style={{ color: '#94a3b8' }}>
                        Your Position
                    </p>
                    <p
                        className='text-2xl font-bold'
                        style={{ color: '#c4b5fd' }}
                    >
                        #{myResult.rank}
                    </p>
                    <p className='text-sm' style={{ color: '#a78bfa' }}>
                        {myResult.score} points •{' '}
                        {myResult.correctAnswers}/{results[0]?.correctAnswers > 0 ? questions?.length || '?' : '?'} correct •{' '}
                        {Math.round(myResult.percentage)}%
                    </p>
                </div>
            )}

            {/* Full Results Table */}
            <div
                className='rounded-xl overflow-hidden mb-6'
                style={{
                    background: 'rgba(30, 30, 50, 0.4)',
                    border: '1px solid rgba(139, 92, 246, 0.1)',
                }}
            >
                <div
                    className='px-4 py-3'
                    style={{
                        background: 'rgba(20, 20, 35, 0.8)',
                        borderBottom: '1px solid rgba(139,92,246,0.1)',
                    }}
                >
                    <h3
                        className='text-sm font-semibold flex items-center gap-2'
                        style={{ color: '#e2e8f0' }}
                    >
                        <Medal size={16} style={{ color: '#a78bfa' }} />
                        Full Leaderboard
                    </h3>
                </div>
                <div className='divide-y' style={{ borderColor: 'rgba(139,92,246,0.05)' }}>
                    {results.map((player) => {
                        const isMe =
                            player.userId?.toString() === currentUserId;

                        return (
                            <div
                                key={player.userId}
                                className='flex items-center gap-3 px-4 py-3'
                                style={{
                                    background: isMe
                                        ? 'rgba(139, 92, 246, 0.08)'
                                        : 'transparent',
                                }}
                            >
                                <span
                                    className='w-8 text-center font-bold text-sm'
                                    style={{
                                        color:
                                            player.rank <= 3
                                                ? '#f59e0b'
                                                : '#64748b',
                                    }}
                                >
                                    #{player.rank}
                                </span>
                                <div
                                    className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0'
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                        color: '#fff',
                                    }}
                                >
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
                                <span
                                    className='flex-1 text-sm font-medium'
                                    style={{
                                        color: isMe ? '#c4b5fd' : '#e2e8f0',
                                    }}
                                >
                                    {player.username}{' '}
                                    {isMe && (
                                        <span style={{ color: '#8b5cf6' }}>
                                            (You)
                                        </span>
                                    )}
                                </span>
                                <span
                                    className='text-sm font-medium'
                                    style={{ color: '#4ade80' }}
                                >
                                    {player.correctAnswers} correct
                                </span>
                                <span
                                    className='text-sm font-bold min-w-[60px] text-right'
                                    style={{ color: '#a78bfa' }}
                                >
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
                    className='flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all cursor-pointer'
                    style={{
                        background: 'rgba(30, 30, 50, 0.6)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        color: '#e2e8f0',
                    }}
                >
                    <ArrowLeft size={18} />
                    Back to Lobby
                </button>
                {isHost && (
                    <button
                        onClick={onPlayAgain}
                        className='flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all cursor-pointer'
                        style={{
                            background:
                                'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                            boxShadow:
                                '0 4px 15px rgba(139, 92, 246, 0.4)',
                        }}
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
