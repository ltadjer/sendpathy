import { io, Socket } from 'socket.io-client';

class WebSocketService {
    private socket: Socket;

    constructor() {
        const token = localStorage.getItem('access_token');
        console.log('toekn',token);
        this.socket = io('https://api.sendpathy.aaa/events', {
            transports: ['websocket'],
            auth: {
                token: token
            }
        });
    }

    on(event: string, callback: (data: any) => void) {
        this.socket.on(event, callback);
    }

    disconnect() {
        this.socket.disconnect();
    }

    emit(event: string, data: any) {
        this.socket.emit(event, data);
    }
}

export default new WebSocketService();