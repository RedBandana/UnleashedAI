import * as io from 'socket.io';

export class SocketHandlerService {
    constructor(public sio: io.Server) {}

    sendToEveryoneInRoom(roomName: string, nameEvent: string, dataEvent?: unknown) {
        this.sio.to(roomName).emit(nameEvent, dataEvent);
    }
    sendToEveryone(nameEvent: string, dataEvent: unknown) {
        this.sio.sockets.emit(nameEvent, dataEvent);
    }
    socketJoin(socket: io.Socket, roomName: string) {
        socket.join(roomName);
    }
    socketEmit(socket: io.Socket, nameEvent: string, dataEvent?: unknown) {
        socket.emit(nameEvent, dataEvent);
    }
    socketEmitRoom(socket: io.Socket, roomName: string, nameEvent: string, dataEvent?: unknown) {
        socket.to(roomName).emit(nameEvent, dataEvent);
    }
    socketLeaveRoom(socket: io.Socket, roomName: string) {
        socket.leave(roomName);
    }

    handleDisconnecting(socket: io.Socket) {
        console.info('disconnecting socket');
        this.sendToEveryone('message', 'event');
    }

    handleReconnect(socket: io.Socket) {
        console.info('reconnecting socket');
        this.sendToEveryone('message', 'event');
    }
}
