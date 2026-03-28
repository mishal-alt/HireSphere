import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";


import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db";

import authRoutes from "./routes/authRoutes";
import companyRoutes from "./routes/companyRoutes";
import userRoutes from "./routes/userRoutes";
import candidateRoutes from "./routes/candidateRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import googleRoutes from "./routes/google.routes";
import dashboardRoutes from "./routes/dashboardRoutes";
import jobRoutes from "./routes/jobRoutes";
import chatRoutes from "./routes/chatRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import publicRoutes from "./routes/publicRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { Message, Conversation } from "./models/Chat";
import { sendNotification } from "./utils/notificationUtils";

connectDB();
const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
});


app.set('io', io); // This lets you use 'io' in your route handlers


app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/auth", googleRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/public", publicRoutes);

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.send("HireSphere API Running with TypeScript 🚀");
});

// Socket.io Real-time logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  // Notification logic
  socket.on("join_user_room", (userId) => {
    socket.join(userId);
    console.log(`[Socket] User ${userId} joined their personal room ${userId}`);
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`[Socket] Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on("send_message", async (data) => {
    const { conversationId, senderId, content, companyId } = data;

    try {
      // 1. Create and save message
      const newMessage = await Message.create({
        conversationId,
        senderId,
        content,
        companyId
      });

      // 2. Update conversation's last message
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: newMessage._id
      });

      // 3. Emit message back to the room members
      io.to(conversationId).emit("receive_message", newMessage);

      // 4. Emit Notification to the recipient(s)
      const conversation = await Conversation.findById(conversationId).populate('participants', 'name');
      if (conversation) {
        for (const participant of conversation.participants as any[]) {
          if (participant._id.toString() !== senderId.toString()) {
            await sendNotification(io, participant._id.toString(), {
              title: "New Message",
              message: `New message from ${participant.name}`, // Should be sender name but placeholder for now
              type: "chat_message",
              metadata: { conversationId }
            });
          }
        }
      }
    } catch (error) {
      console.error("Socket Send Message Error:", error);
    }
  });

  socket.on("mark_read", async (data) => {
    const { conversationId, readerId } = data;
    try {
      await Message.updateMany(
        { conversationId, senderId: { $ne: readerId }, isRead: false },
        { $set: { isRead: true } }
      );
      // Notify the room that messages were read
      io.to(conversationId).emit("messages_read", { conversationId, readerId });
    } catch (error) {
      console.error("Socket Mark Read Error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Error Handler Middleware (Should be last)
app.use(errorHandler);

const PORT: number = Number(process.env.PORT) || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});