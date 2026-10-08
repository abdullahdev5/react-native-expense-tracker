// dotenv config
import "dotenv/config";

import express from "express";
import { connect as connectDB, disconnect as disconnectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";
import walletRoutes from "./routes/wallet.routes";
import categoriesRoutes from "./routes/category.routes";
import transactionRoutes from "./routes/transaction.routes";
import insightRoutes from "./routes/insight.routes";
import { Server } from "socket.io";
import http from "http";
import errorHandler from "./middleware/errorHandler";
import { socketService } from "./services/socket.service";
import { init as initSocket } from "./config/socket";
import { authService } from "./services/auth.service";

const app = express();
const server = http.createServer(app);
// Initialize Socket.Io Server
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());


authService.init();
// auth routes
app.use("/api/auth", authRoutes);

// dashboard routes
app.use('/api', dashboardRoutes);

// user routes
app.use('/api', userRoutes);

// wallet routes
app.use('/api', walletRoutes);

// categories routes
app.use('/api', categoriesRoutes);

// transaction routes
app.use('/api', transactionRoutes);

// insight routes
app.use('/api', insightRoutes);


// Express js Error Handling middleware
app.use(errorHandler);

// Initializing Socket
initSocket(io);
// Initializing Socket Service
socketService.init(io);

const startServer = async () => {
  try {
    await connectDB();

    // Server Connection
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server", error);
    process.exit(1);
  }
};


startServer();


const shutdown = async () => {
  console.log("Shutting down...");
  await disconnectDB();
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
