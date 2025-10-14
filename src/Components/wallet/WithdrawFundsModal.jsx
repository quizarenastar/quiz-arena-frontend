import WalletService from '../../service/WalletService';

function WithdrawFundsModal({
    wallet,
    withdrawAmount,
    setWithdrawAmount,
    withdrawUpiId,
    setWithdrawUpiId,
    requesting,
    handleRequestWithdrawal,
    setShowWithdraw,
}) {
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4'>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                    Request Withdrawal
                </h3>

                <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4'>
                    <p className='text-sm text-blue-800 dark:text-blue-300'>
                        <strong>Note:</strong> Funds will be transferred to your
                        UPI ID after admin approval (3-5 business days).
                    </p>
                </div>

                <div className='space-y-4 mb-6'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Amount (₹) <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='number'
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                            placeholder='Enter amount (min ₹100)'
                            min='100'
                            max={wallet?.balance || 0}
                        />
                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                            Available:{' '}
                            {WalletService.formatAmount(wallet?.balance || 0)}
                        </p>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            UPI ID <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='text'
                            value={withdrawUpiId}
                            onChange={(e) => setWithdrawUpiId(e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                            placeholder='yourname@paytm'
                        />
                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                            Enter your UPI ID where you want to receive the
                            funds
                        </p>
                    </div>
                </div>

                <div className='flex space-x-4'>
                    <button
                        onClick={handleRequestWithdrawal}
                        disabled={
                            requesting ||
                            !withdrawAmount ||
                            parseFloat(withdrawAmount) < 100 ||
                            !withdrawUpiId
                        }
                        className='flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors'
                    >
                        {requesting ? 'Processing...' : 'Request Withdrawal'}
                    </button>
                    <button
                        onClick={() => {
                            setShowWithdraw(false);
                            setWithdrawAmount('');
                            setWithdrawUpiId('');
                        }}
                        className='flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors'
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WithdrawFundsModal;
