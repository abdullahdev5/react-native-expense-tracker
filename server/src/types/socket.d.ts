import { SOCKET_EVENTS } from "../constants/socketEvents";
import { UserPayload } from "./user";

declare module 'socket.io' {
    interface Socket {
        user?: UserPayload;
    }
}


export type SocketEvents = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];