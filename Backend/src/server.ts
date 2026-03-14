import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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


connectDB();
const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors({
  origin: ["http://localhost:3000"], // Use your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/auth", googleRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("HireSphere API Running with TypeScript 🚀");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT: number = Number(process.env.PORT) || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});