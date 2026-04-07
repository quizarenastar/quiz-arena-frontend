import ApiUrl from '../configs/apiUrls.js';
import { makeRequest } from './apiClient.js';

class WarRoomService {
    // Create a new war room
    async createRoom(roomData) {
        return makeRequest(ApiUrl.WAR_ROOMS.CREATE, {
            method: 'POST',
            body: JSON.stringify(roomData),
        });
    }

    // List public war rooms
    async getPublicRooms(filters = {}) {
        const query = new URLSearchParams(filters).toString();
        const url = query
            ? `${ApiUrl.WAR_ROOMS.PUBLIC}?${query}`
            : ApiUrl.WAR_ROOMS.PUBLIC;
        return makeRequest(url);
    }

    // Get user's rooms
    async getMyRooms() {
        return makeRequest(ApiUrl.WAR_ROOMS.MY_ROOMS);
    }

    // Get room by code
    async getRoomByCode(roomCode) {
        return makeRequest(ApiUrl.WAR_ROOMS.GET_BY_CODE(roomCode));
    }

    // Join a room
    async joinRoom(roomCode) {
        return makeRequest(ApiUrl.WAR_ROOMS.JOIN(roomCode), {
            method: 'POST',
        });
    }

    // Leave a room
    async leaveRoom(roomId) {
        return makeRequest(ApiUrl.WAR_ROOMS.LEAVE(roomId), {
            method: 'POST',
        });
    }

    // Delete a room
    async deleteRoom(roomId) {
        return makeRequest(ApiUrl.WAR_ROOMS.DELETE(roomId), {
            method: 'DELETE',
        });
    }

    // Get room quiz history
    async getRoomHistory(roomId) {
        return makeRequest(ApiUrl.WAR_ROOMS.HISTORY(roomId));
    }

    // Get detailed round results
    async getRoundDetails(roomId, quizId) {
        return makeRequest(ApiUrl.WAR_ROOMS.ROUND_DETAILS(roomId, quizId));
    }
}

export default new WarRoomService();
