import { Socket as DefaultSocket } from 'socket.io';

/**
 * Custom socket interface extending the default socket with an optional user property.
 */
export interface CustomSocket extends DefaultSocket {
    user?: any;
}