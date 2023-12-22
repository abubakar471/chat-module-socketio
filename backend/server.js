import express from "express"
import http from "http"
const app = express();
const server = http.createServer(app);
import dotenv from "dotenv"
import mongoose from "mongoose"
import colors from "colors"
import { Server } from "socket.io"
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://app-chat-module.vercel.app"
    }
})
dotenv.config();


// routes
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js"

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("successfully connected to the database".magenta.bold);
    })
    .catch((err) => {
        console.log("Error connection database : ", err);
    })

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(`server is running on port ${port}`.yellow.bold);
})

io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room : ", room);
    })

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log("chat.users is not defined");

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));

    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    // clean up
    socket.off("setup", () => {
        console.log("user disconnected");
        socket.leave(userData._id);
    })
})