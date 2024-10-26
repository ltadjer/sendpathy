import { io, Socket } from 'socket.io-client';

class WebSocketService {
    public socket: Socket;

    constructor() {
        const token = localStorage.getItem('access_token');
        this.socket = io('https://api.sendpathy.aaa/events', {
            transports: ['websocket'],
            auth: {
                token: token
            }
        });

        // Handle WebSocket connection
        this.socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        // Handle WebSocket disconnection
        this.socket.on('disconnect', () => {
            console.warn('WebSocket disconnected');
        });

        // Handle WebSocket errors
        this.socket.on('exception', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    /**
     * Register an event listener.
     * @param event - The event name.
     * @param callback - The callback function to handle the event.
     */
    on(event: string, callback: (data: any) => void) {
        this.socket.on(event, callback);
    }

    /**
     * Remove an event listener.
     * @param event - The event name.
     * @param callback - The callback function to remove.
     */

    off(event: string, callback?: (data: any) => void) {
        if (callback) {
            this.socket.off(event, callback);
        } else {
            this.socket.off(event);
        }
    }

    /**
     * Emit an event to the server.
     * @param event - The event name.
     * @param data - The data to send with the event.
     */
    emit(event: string, data: any) {
        this.socket.emit(event, data);
    }

    /**
     * Disconnect the WebSocket.
     */
    disconnect() {
        this.socket.disconnect();
    }
}

export default new WebSocketService();