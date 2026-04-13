import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

class SocketService {
    private socket: Socket | null = null;

    connect(token: string) {
        if (this.socket) return this.socket;

        this.socket = io(SOCKET_URL, {
            auth: { token },
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        this.socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    getSocket() {
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    registerUser(userId: string) {
        if (this.socket) {
            this.socket.emit('join_user_room', userId);
        }
    }

    joinRoom(roomId: string) {
        if (this.socket) {
            this.socket.emit('join_room', roomId);
        }
    }
}

export const socketService = new SocketService();
