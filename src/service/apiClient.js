/**
 * Shared API Client for Quiz Arena Frontend
 * Centralizes HTTP request logic to avoid duplication across services
 */

import { store, persistor } from '../store/store';
import { logout } from '../store/slices/authSlice';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

let isRedirectingToLogin = false;

/**
 * Handle 401 Unauthorized — clear auth state, purge persisted storage,
 * then redirect to login. Awaits the purge so localStorage is clean
 * before the page reloads.
 */
async function handleUnauthorized() {
    if (isRedirectingToLogin) return;
    isRedirectingToLogin = true;

    // Clear Redux auth state
    store.dispatch(logout());

    // Purge redux-persist storage (waits for localStorage to be cleared)
    await persistor.purge();

    // Redirect to login
    window.location.href = '/login';
}

/**
 * Make an authenticated API request
 * @param {string} url - Full URL to request
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Object>} Parsed JSON response
 * @throws {Error} If request fails or returns non-2xx status
 */
async function makeRequest(url, options = {}) {
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

        // If token is expired/invalid, force logout
        if (response.status === 401) {
            handleUnauthorized();
            throw new Error('Session expired. Please log in again.');
        }

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Build URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Query parameters object
 * @returns {string} URL with query string
 */
function buildUrl(baseUrl, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export { makeRequest, buildUrl, BASE_URL };
