import toast from 'react-hot-toast';

function AddFundsModal({
    wallet,
    setWallet,
    addFundsAmount,
    setAddFundsAmount,
    addingFunds,
    handleAddFunds,
    setShowAddFunds,
}) {
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto'>
                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                    Add Funds to Wallet
                </h3>

                <div className='grid md:grid-cols-2 gap-6 mb-6'>
                    {/* Payment Instructions */}
                    <div className='space-y-4'>
                        <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
                            <h4 className='font-semibold text-blue-900 dark:text-blue-200 mb-2'>
                                Payment Instructions
                            </h4>
                            <ol className='list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-300'>
                                <li>Scan the QR code or use UPI ID</li>
                                <li>Enter the amount you want to add</li>
                                <li>Complete the payment</li>
                                <li>Copy transaction ID (if available)</li>
                                <li>Submit the request below</li>
                                <li>Wait for admin approval</li>
                            </ol>
                        </div>

                        <div className='bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg'>
                            <p className='text-sm text-yellow-800 dark:text-yellow-300'>
                                <strong>Note:</strong> Your funds will be
                                credited after admin verification. This usually
                                takes 10-30 minutes.
                            </p>
                        </div>
                    </div>

                    {/* QR Code and UPI ID */}
                    <div className='space-y-4'>
                        {/* QR Code */}
                        <div className='bg-white dark:bg-gray-700 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600'>
                            <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center'>
                                Scan QR Code to Pay
                            </p>
                            <div className='flex justify-center mb-3'>
                                <img
                                    src='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=quizarena@paytm&pn=QuizArena&cu=INR'
                                    alt='Payment QR Code'
                                    className='w-48 h-48 border-4 border-gray-300 dark:border-gray-600 rounded-lg'
                                />
                            </div>
                        </div>

                        {/* UPI ID */}
                        <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                            <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                UPI ID:
                            </p>
                            <div className='flex items-center gap-2'>
                                <code className='flex-1 bg-white dark:bg-gray-800 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm font-mono'>
                                    quizarena@paytm
                                </code>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            'quizarena@paytm'
                                        );
                                        toast.success('UPI ID copied!');
                                    }}
                                    className='px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm'
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Amount and Transaction ID Input */}
                <div className='space-y-4 mb-6'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Amount (₹) <span className='text-red-500'>*</span>
                        </label>
                        <input
                            type='number'
                            value={addFundsAmount}
                            onChange={(e) => setAddFundsAmount(e.target.value)}
                            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                            placeholder='Enter amount (min ₹10)'
                            min='10'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Transaction ID{' '}
                            <span className='text-gray-500 text-xs'>
                                (Optional)
                            </span>
                        </label>
                        <input
                            type='text'
                            value={wallet?.transactionId || ''}
                            onChange={(e) =>
                                setWallet({
                                    ...wallet,
                                    transactionId: e.target.value,
                                })
                            }
                            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                            placeholder='Enter transaction ID (if available)'
                        />
                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                            Providing transaction ID helps in faster
                            verification
                        </p>
                    </div>
                </div>

                <div className='flex space-x-4'>
                    <button
                        onClick={handleAddFunds}
                        disabled={
                            addingFunds ||
                            !addFundsAmount ||
                            parseFloat(addFundsAmount) < 10
                        }
                        className='flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors'
                    >
                        {addingFunds
                            ? 'Submitting Request...'
                            : 'Submit Request'}
                    </button>
                    <button
                        onClick={() => {
                            setShowAddFunds(false);
                            setAddFundsAmount('');
                            setWallet({
                                ...wallet,
                                transactionId: '',
                            });
                        }}
                        className='flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors'
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddFundsModal;
