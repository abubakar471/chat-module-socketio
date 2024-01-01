import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

export const sendMessage = async (req, res) => {
    const { content, chatId, file } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        file: file,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email fcmToken"
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message
        });

        res.json(message);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}

export const allMessages = async (req, res) => {
    const chatId = req.params.chatId;

    try {
        const messages = await Message.find({ chat: chatId }).populate("sender", "name pic email").populate("chat");

        res.json(messages);
    } catch (err) {
        console.log(err);
        res.status(400);
    }
}