import * as http from 'http';
import * as io from 'socket.io';
import { SocketHandlerService } from './socket-handler.service';

export class SocketManager {
    sio: io.Server;
    private socketHandlerService: SocketHandlerService;
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.socketHandlerService = new SocketHandlerService(this.sio);
    }

    handleSockets() {
        this.sio.on('connection', (socket) => {
            socket.on('disconnecting', () => {
                this.socketHandlerService.handleDisconnecting(socket);
            });

            socket.on('reconnect', () => {
                this.socketHandlerService.handleReconnect(socket);
            });
        });
    }
}
