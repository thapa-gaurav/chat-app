import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.route.js";
import messageRoutes from "../routes/message.route.js";
import blockedRoutes from "../routes/blockedUser.routes.js";
import { connectDB } from "../lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "../lib/socket.js";
dotenv.config();

const port = process.env.PORT;

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users/", blockedRoutes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
