import { Server, Socket } from "socket.io";
import { verifyToken } from "../middleware/authMiddleware";

const init = (io: Server) => {
  // Socket IO Middleware for JWT
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("UnAuthorized, token missing!"));
    }
    const user = verifyToken(token);

    socket.user = user;
    next();
  });

  // Socket Io Connection
  io.on("connection", (socket: Socket) => {
    console.log(
      `User Connected: ${socket.user?.email} (ID: ${socket.user?._id})`,
    );

    if (!socket.user) {
      console.log('User missing on Socket!');
      return;
    }

    // Joining User
    socket.join(socket.user._id.toString());

    // User disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected!");
    });
  });
};

export { init };
