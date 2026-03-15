import React from 'react';
import { Trophy, Users, DollarSign, TrendingUp } from 'lucide-react';

const PrizePoolDisplay = ({
    participantCount,
    entryFee,
    minParticipants = 5,
}) => {
    const calculateDistribution = () => {
        const totalPool = participantCount * entryFee;
        const platformFee = totalPool * 0.2; // 20%
        const creatorFee = totalPool * 0.3; // 30%
        const prizeMoney = totalPool * 0.5; // 50%

        let winners = [];
        let distribution = null;

        if (participantCount < minParticipants) {
            distribution = {
                status: 'cancelled',
                message: `Need ${minParticipants - participantCount} more participant(s) to proceed`,
                totalPool,
                refund: entryFee,
            };
        } else if (participantCount >= 5 && participantCount < 10) {
            winners = [{ rank: 1, label: 'Winner', amount: prizeMoney }];
            distribution = {
                status: 'active',
                totalPool,
                platformFee,
                creatorFee,
                prizeMoney,
                winners,
            };
        } else if (participantCount >= 10 && participantCount < 20) {
            winners = [
                { rank: 1, label: '1st Place', amount: prizeMoney * 0.6 },
                { rank: 2, label: '2nd Place', amount: prizeMoney * 0.4 },
            ];
            distribution = {
                status: 'active',
                totalPool,
                platformFee,
                creatorFee,
                prizeMoney,
                winners,
            };
        } else if (participantCount >= 20) {
            const winnerCount = Math.ceil(participantCount * 0.1); // Top 10% (rounded up)
            const prizePerWinner = prizeMoney / winnerCount;
            winners = Array.from(
                { length: Math.min(winnerCount, 5) },
                (_, i) => ({
                    rank: i + 1,
                    label: `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Place`,
                    amount: prizePerWinner,
                }),
            );

            distribution = {
                status: 'active',
                totalPool,
                platformFee,
                creatorFee,
                prizeMoney,
                winners,
                totalWinners: winnerCount,
                showingTop: Math.min(winnerCount, 5),
            };
        }

        return distribution;
    };

    const dist = calculateDistribution();

    if (!dist) return null;

    return (
        <div className='bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg shadow-lg p-6 border-2 border-yellow-300 dark:border-yellow-700'>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center'>
                    <Trophy className='text-yellow-500 mr-2' size={28} />
                    Prize Pool
                </h3>
                <div className='text-right'>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Total Pool
                    </p>
                    <p className='text-2xl font-bold text-yellow-600 dark:text-yellow-400'>
                        ₹{dist.totalPool}
                    </p>
                </div>
            </div>

            {dist.status === 'cancelled' ? (
                <div className='bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-4'>
                    <p className='text-red-800 dark:text-red-200 font-semibold text-center'>
                        {dist.message}
                    </p>
                    <p className='text-sm text-red-600 dark:text-red-300 text-center mt-2'>
                        Full refund of ₹{dist.refund} if quiz is cancelled
                    </p>
                </div>
            ) : (
                <>
                    {/* Prize Distribution */}
                    <div className='space-y-3 mb-4'>
                        {dist.winners.map((winner, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between p-3 rounded-lg ${
                                    winner.rank === 1
                                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-800/50 dark:to-yellow-700/50 border-2 border-yellow-400'
                                        : winner.rank === 2
                                          ? 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700/50 dark:to-gray-600/50 border-2 border-gray-400'
                                          : 'bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-800/50 dark:to-orange-700/50 border-2 border-orange-400'
                                }`}
                            >
                                <div className='flex items-center space-x-3'>
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                            winner.rank === 1
                                                ? 'bg-yellow-500 text-white'
                                                : winner.rank === 2
                                                  ? 'bg-gray-500 text-white'
                                                  : 'bg-orange-500 text-white'
                                        }`}
                                    >
                                        {winner.rank}
                                    </div>
                                    <span className='font-semibold text-gray-900 dark:text-white'>
                                        {winner.label}
                                    </span>
                                </div>
                                <span className='text-xl font-bold text-gray-900 dark:text-white'>
                                    ₹{Math.round(winner.amount)}
                                </span>
                            </div>
                        ))}

                        {dist.totalWinners &&
                            dist.totalWinners > dist.showingTop && (
                                <p className='text-sm text-center text-gray-600 dark:text-gray-400 italic'>
                                    + {dist.totalWinners - dist.showingTop} more
                                    winners (Top{' '}
                                    {Math.round(
                                        (dist.totalWinners / participantCount) *
                                            100,
                                    )}
                                    % of participants)
                                </p>
                            )}
                    </div>

                    {/* Fee Breakdown */}
                    <div className='border-t border-yellow-300 dark:border-yellow-700 pt-4 space-y-2'>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-600 dark:text-gray-400 flex items-center'>
                                <Trophy size={14} className='mr-1' />
                                Prize Money (50%)
                            </span>
                            <span className='font-semibold text-gray-900 dark:text-white'>
                                ₹{Math.round(dist.prizeMoney)}
                            </span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-600 dark:text-gray-400 flex items-center'>
                                <Users size={14} className='mr-1' />
                                Creator Fee (30%)
                            </span>
                            <span className='font-semibold text-gray-900 dark:text-white'>
                                ₹{Math.round(dist.creatorFee)}
                            </span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-gray-600 dark:text-gray-400 flex items-center'>
                                <DollarSign size={14} className='mr-1' />
                                Platform Fee (20%)
                            </span>
                            <span className='font-semibold text-gray-900 dark:text-white'>
                                ₹{Math.round(dist.platformFee)}
                            </span>
                        </div>
                    </div>

                    {/* Dynamic Update Message */}
                    <div className='mt-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-3'>
                        <p className='text-xs text-blue-800 dark:text-blue-200 text-center flex items-center justify-center'>
                            <TrendingUp size={14} className='mr-1' />
                            Prize pool updates as more participants join
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default PrizePoolDisplay;
