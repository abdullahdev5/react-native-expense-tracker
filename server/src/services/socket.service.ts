import { Server } from "socket.io";
import { SocketEvents } from "../types/socket";

class SocketService {

    private io: Server | null = null;


    init(ioInstance: Server) {
        this.io = ioInstance;
    }


    emitToUser<T>(userId: string, event: SocketEvents, data: T) {
        if (this.io) {
            this.io.to(userId).emit(event, data);
        } else {
            console.error(`SocketService: IO instance is not initailized!`);
        }
    }

}

export const socketService = new SocketService();