import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Plus,
    Minus,
    History,
    DollarSign,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import WalletService from '../service/WalletService';

const Wallet = () => {
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addFundsAmount, setAddFundsAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [showAddFunds, setShowAddFunds] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [addingFunds, setAddingFunds] = useState(false);
    const [requesting, setRequesting] = useState(false);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            setLoading(true);
            const [walletResponse, transactionsResponse] = await Promise.all([
                WalletService.getWallet(),
                WalletService.getTransactionHistory({ limit: 10 }),
            ]);

            setWallet(walletResponse.data.wallet);
            setTransactions(transactionsResponse.data.transactions || []);
        } catch (error) {
            toast.error(error.message || 'Failed to fetch wallet data');
            console.error('Wallet Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFunds = async () => {
        const amount = parseFloat(addFundsAmount);
        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (amount < 10) {
            toast.error('Minimum amount to add is ₹10');
            return;
        }

        setAddingFunds(true);
        try {
            await WalletService.addFunds(amount);
            toast.success('Funds added successfully!');
            setAddFundsAmount('');
            setShowAddFunds(false);
            fetchWalletData(); // Refresh wallet data
        } catch (error) {
            toast.error(error.message || 'Failed to add funds');
            console.error('Add Funds Error:', error);
        } finally {
            setAddingFunds(false);
        }
    };

    const handleRequestWithdrawal = async () => {
        const amount = parseFloat(withdrawAmount);
        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (amount > wallet.balance) {
            toast.error('Insufficient balance');
            return;
        }

        if (amount < 100) {
            toast.error('Minimum withdrawal amount is ₹100');
            return;
        }

        setRequesting(true);
        try {
            await WalletService.requestWithdrawal(amount, {
                method: 'bank_transfer',
                // Add payment details here based on user input
            });
            toast.success('Withdrawal request submitted successfully!');
            setWithdrawAmount('');
            setShowWithdraw(false);
            fetchWalletData(); // Refresh wallet data
        } catch (error) {
            toast.error(error.message || 'Failed to request withdrawal');
            console.error('Withdrawal Error:', error);
        } finally {
            setRequesting(false);
        }
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'fund_addition':
                return <TrendingUp className='text-green-500' size={16} />;
            case 'quiz_earning':
                return <TrendingUp className='text-green-500' size={16} />;
            case 'quiz_fee':
                return <TrendingDown className='text-red-500' size={16} />;
            case 'withdrawal':
                return <TrendingDown className='text-red-500' size={16} />;
            case 'refund':
                return <TrendingUp className='text-blue-500' size={16} />;
            default:
                return <DollarSign className='text-gray-500' size={16} />;
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Loading wallet...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
            <div className='max-w-4xl mx-auto px-4'>
                {/* Header */}
                <div className='mb-6'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white flex items-center'>
                        <CreditCard className='mr-3' size={32} />
                        My Wallet
                    </h1>
                </div>

                {/* Wallet Balance Card */}
                <div className='bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 mb-6 text-white'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <p className='text-yellow-100 text-sm'>
                                Available Balance
                            </p>
                            <p className='text-3xl font-bold'>
                                {WalletService.formatAmount(
                                    wallet?.balance || 0
                                )}
                            </p>
                        </div>
                        <div className='text-right'>
                            <p className='text-yellow-100 text-sm'>
                                Total Earnings
                            </p>
                            <p className='text-xl font-semibold'>
                                {WalletService.formatAmount(
                                    wallet?.totalEarnings || 0
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                    <button
                        onClick={() => setShowAddFunds(true)}
                        className='p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors'
                    >
                        <Plus size={20} />
                        <span>Add Funds</span>
                    </button>

                    <button
                        onClick={() => setShowWithdraw(true)}
                        disabled={!wallet?.balance || wallet.balance < 100}
                        className='p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors'
                    >
                        <Minus size={20} />
                        <span>Request Withdrawal</span>
                    </button>
                </div>

                {/* Transaction History */}
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
                    <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
                        <h2 className='text-xl font-semibold text-gray-900 dark:text-white flex items-center'>
                            <History className='mr-2' size={20} />
                            Recent Transactions
                        </h2>
                    </div>

                    <div className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {transactions.length === 0 ? (
                            <div className='p-6 text-center text-gray-500 dark:text-gray-400'>
                                No transactions yet
                            </div>
                        ) : (
                            transactions.map((transaction) => (
                                <div
                                    key={transaction._id}
                                    className='p-6 flex items-center justify-between'
                                >
                                    <div className='flex items-center space-x-4'>
                                        {getTransactionIcon(transaction.type)}
                                        <div>
                                            <p className='font-medium text-gray-900 dark:text-white'>
                                                {WalletService.getTransactionTypeLabel(
                                                    transaction.type
                                                )}
                                            </p>
                                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                {new Date(
                                                    transaction.createdAt
                                                ).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='text-right'>
                                        <p
                                            className={`font-semibold ${
                                                [
                                                    'fund_addition',
                                                    'quiz_earning',
                                                    'refund',
                                                ].includes(transaction.type)
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }`}
                                        >
                                            {[
                                                'fund_addition',
                                                'quiz_earning',
                                                'refund',
                                            ].includes(transaction.type)
                                                ? '+'
                                                : '-'}
                                            {WalletService.formatAmount(
                                                transaction.amount
                                            )}
                                        </p>
                                        <p
                                            className={`text-xs px-2 py-1 rounded-full ${
                                                transaction.status ===
                                                'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : transaction.status ===
                                                      'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {transaction.status}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Add Funds Modal */}
                {showAddFunds && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                                Add Funds to Wallet
                            </h3>

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    Amount (₹)
                                </label>
                                <input
                                    type='number'
                                    value={addFundsAmount}
                                    onChange={(e) =>
                                        setAddFundsAmount(e.target.value)
                                    }
                                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                    placeholder='Enter amount (min ₹10)'
                                    min='10'
                                />
                            </div>

                            <div className='flex space-x-4'>
                                <button
                                    onClick={handleAddFunds}
                                    disabled={addingFunds}
                                    className='flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors'
                                >
                                    {addingFunds
                                        ? 'Processing...'
                                        : 'Add Funds'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddFunds(false);
                                        setAddFundsAmount('');
                                    }}
                                    className='flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors'
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Withdrawal Modal */}
                {showWithdraw && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                                Request Withdrawal
                            </h3>

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    Amount (₹)
                                </label>
                                <input
                                    type='number'
                                    value={withdrawAmount}
                                    onChange={(e) =>
                                        setWithdrawAmount(e.target.value)
                                    }
                                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                    placeholder='Enter amount (min ₹100)'
                                    min='100'
                                    max={wallet?.balance || 0}
                                />
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                    Available:{' '}
                                    {WalletService.formatAmount(
                                        wallet?.balance || 0
                                    )}
                                </p>
                            </div>

                            <div className='flex space-x-4'>
                                <button
                                    onClick={handleRequestWithdrawal}
                                    disabled={requesting}
                                    className='flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors'
                                >
                                    {requesting
                                        ? 'Processing...'
                                        : 'Request Withdrawal'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowWithdraw(false);
                                        setWithdrawAmount('');
                                    }}
                                    className='flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors'
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wallet;
