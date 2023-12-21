import express from "express"
const app = express();
import dotenv from "dotenv"
import mongoose from "mongoose"
import colors from "colors"
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

app.listen(port, () => {
    console.log(`server is running on port ${port}`.yellow.bold);
})