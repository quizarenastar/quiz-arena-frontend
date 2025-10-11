import ApiUrl from '../configs/apiUrls.js';

class WalletService {
    // Helper method for API calls
    async makeRequest(url, options = {}) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers,
            };

            const response = await fetch(url, {
                ...options,
                headers,
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('Wallet API Error:', error);
            throw error;
        }
    }

    // Wallet operations
    async getWallet() {
        return this.makeRequest(ApiUrl.WALLET.GET_WALLET);
    }

    async addFunds(amount, paymentMethod = 'card') {
        return this.makeRequest(ApiUrl.WALLET.ADD_FUNDS, {
            method: 'POST',
            body: JSON.stringify({ amount, paymentMethod }),
        });
    }

    async getTransactionHistory(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams
            ? `${ApiUrl.WALLET.TRANSACTION_HISTORY}?${queryParams}`
            : ApiUrl.WALLET.TRANSACTION_HISTORY;
        return this.makeRequest(url);
    }

    async requestWithdrawal(amount, paymentDetails) {
        return this.makeRequest(ApiUrl.WALLET.REQUEST_WITHDRAWAL, {
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

    getTransactionTypeLabel(type) {
        const labels = {
            quiz_fee: 'Quiz Fee',
            quiz_earning: 'Quiz Earning',
            fund_addition: 'Funds Added',
            withdrawal: 'Withdrawal',
            refund: 'Refund',
        };
        return labels[type] || type;
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
