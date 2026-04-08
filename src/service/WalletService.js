import ApiUrl from '../configs/apiUrls.js';
import { makeRequest, buildUrl } from './apiClient.js';

class WalletService {
    // Wallet operations
    async getWallet() {
        return makeRequest(ApiUrl.WALLET.GET_WALLET);
    }

    async addFunds(data) {
        return makeRequest(ApiUrl.WALLET.ADD_FUNDS, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getTransactionHistory(filters = {}) {
        const url = buildUrl(ApiUrl.WALLET.TRANSACTION_HISTORY, filters);
        return makeRequest(url);
    }

    async requestWithdrawal(amount, paymentDetails) {
        return makeRequest(ApiUrl.WALLET.REQUEST_WITHDRAWAL, {
            method: 'POST',
            body: JSON.stringify({ amount, ...paymentDetails }),
        });
    }

    // Utility methods
    formatAmount(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    }

    getTransactionTypeLabel(transaction) {
        const type =
            typeof transaction === 'string' ? transaction : transaction.type;
        const isEntryFee =
            typeof transaction === 'object' &&
            type === 'payment' &&
            (transaction.relatedQuizId || transaction.metadata?.isEscrow);

        if (isEntryFee) return 'Entry Fee Paid';

        const labels = {
            payment: 'Fund Addition',
            earning: 'Quiz Earning',
            withdrawal: 'Withdrawal',
            refund: 'Refund',
            bonus: 'Bonus',
            penalty: 'Penalty',
        };
        return labels[type] || type;
    }

    isDebitTransaction(transaction) {
        const type =
            typeof transaction === 'string' ? transaction : transaction.type;
        const isEntryFee =
            typeof transaction === 'object' &&
            type === 'payment' &&
            (transaction.relatedQuizId || transaction.metadata?.isEscrow);
        return isEntryFee || ['withdrawal', 'penalty'].includes(type);
    }

    getTransactionStatusColor(status) {
        const colors = {
            completed: 'green',
            pending: 'yellow',
            failed: 'red',
            cancelled: 'gray',
        };
        return colors[status] || 'gray';
    }
}

export default new WalletService();
