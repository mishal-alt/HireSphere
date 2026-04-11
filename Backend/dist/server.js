"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore - Polyfill for DOMMatrix missing in Node 18 (Fixes PDF parsing in production)
if (typeof global.DOMMatrix === "undefined") {
    global.DOMMatrix = class DOMMatrix {
        constructor() { }
    };
}
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const candidateRoutes_1 = __importDefault(require("./routes/candidateRoutes"));
const interviewRoutes_1 = __importDefault(require("./routes/interviewRoutes"));
const google_routes_1 = __importDefault(require("./routes/google.routes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const Chat_1 = require("./models/Chat");
const notificationUtils_1 = require("./utils/notificationUtils");
const reminderWorker_1 = require("./utils/reminderWorker");
(0, db_1.default)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST"],
        credentials: true
    },
});
app.set('io', io); // This lets you use 'io' in your route handlers
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve Static Files
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/company", companyRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/candidates", candidateRoutes_1.default);
app.use("/api/interviews", interviewRoutes_1.default);
app.use("/api/auth", google_routes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.use("/api/jobs", jobRoutes_1.default);
app.use("/api/chat", chatRoutes_1.default);
app.use("/api/notifications", notificationRoutes_1.default);
app.use("/api/public", publicRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
app.use("/api/analytics", analyticsRoutes_1.default);
// Root Route
app.get("/", (req, res) => {
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
            const newMessage = await Chat_1.Message.create({
                conversationId,
                senderId,
                content,
                companyId
            });
            // 2. Update conversation's last message
            await Chat_1.Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: newMessage._id
            });
            // 3. Emit message back to the room members
            io.to(conversationId).emit("receive_message", newMessage);
            // 4. Emit Notification to the recipient(s)
            const conversation = await Chat_1.Conversation.findById(conversationId).populate('participants', 'name');
            if (conversation) {
                for (const participant of conversation.participants) {
                    if (participant._id.toString() !== senderId.toString()) {
                        await (0, notificationUtils_1.sendNotification)(io, participant._id.toString(), {
                            title: "New Message",
                            message: `New message from ${participant.name}`, // Should be sender name but placeholder for now
                            type: "chat_message",
                            metadata: { conversationId }
                        });
                    }
                }
            }
        }
        catch (error) {
            console.error("Socket Send Message Error:", error);
        }
    });
    socket.on("mark_read", async (data) => {
        const { conversationId, readerId } = data;
        try {
            await Chat_1.Message.updateMany({ conversationId, senderId: { $ne: readerId }, isRead: false }, { $set: { isRead: true } });
            // Notify the room that messages were read
            io.to(conversationId).emit("messages_read", { conversationId, readerId });
        }
        catch (error) {
            console.error("Socket Mark Read Error:", error);
        }
    });
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
    // 📹 WEBRTC VIDEO SIGNALING LOGIC
    socket.on("join_interview", (data) => {
        const { interviewId, userId } = data;
        socket.join(interviewId);
        console.log(`[Video] Participant ${userId} joined Interview Room: ${interviewId}`);
        // Notify others in the room that a peer has joined
        socket.to(interviewId).emit("participant_joined", { userId });
    });
    socket.on("video_offer", (data) => {
        console.log(`[Video] Relay Offer for ${data.interviewId}`);
        socket.to(data.interviewId).emit("video_offer", { offer: data.offer });
    });
    socket.on("video_answer", (data) => {
        console.log(`[Video] Relay Answer for ${data.interviewId}`);
        socket.to(data.interviewId).emit("video_answer", { answer: data.answer });
    });
    socket.on("new_ice_candidate", (data) => {
        console.log(`[Video] Relay ICE Candidate for ${data.interviewId}`);
        socket.to(data.interviewId).emit("new_ice_candidate", { candidate: data.candidate });
    });
});
// Error Handler Middleware (Should be last)
app.use(errorHandler_1.errorHandler);
const PORT = Number(process.env.PORT) || 5000;
// Start Background Workers
(0, reminderWorker_1.initReminderWorker)(io);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
