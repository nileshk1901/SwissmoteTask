import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// MongoDB Connection
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error(err));

// WebSocket
io.on("connection", (socket) => {
	console.log("A user connected");
	socket.on("joinEvent", (eventId) => {
		socket.join(eventId);
	});
	socket.on("updateAttendees", (eventId) => {
		io.to(eventId).emit("refreshAttendees");
	});
});

server.listen(process.env.PORT || 5000, () => {
	console.log(`Server running on port ${process.env.PORT || 5000}`);
});
