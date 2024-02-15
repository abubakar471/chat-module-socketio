import User from "../models/userModel.js";
import { generateToken } from "../config/generateToken.js";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export const SignUp = async (req, res) => {
    try {
        const { name, email, password, pic } = req.body;

        if (!name || !email || !password) {
            res.status(400).json("Please fill all fields");
        }

        const userExists = await User.findOne({ email: email })

        if (userExists) {
            return res.status(400).json("User already exists!");
        }

        const user = new User({
            name, email, password, pic
        });

        const savedUser = await user.save();

        if (savedUser) {
            return res.status(201).json({
                _id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                pic: savedUser.pic,
                token: generateToken(savedUser._id)
            })
        } else {
            return res.status(400).json("Sign Up Failed. Try Again Later");
        }
    } catch (err) {
        console.log(err);

        return res.status(500).json("Something Went Wrong!");
    }
}

export const authUser = async (req, res) => {
    try {
        const { email, password, fcmToken } = req.body;

        const user = await User.findOne({ email: email });

        if (user && (await user.matchPassword(password))) {
            if (fcmToken) {
                const updateToken = await User.findOneAndUpdate({ email: email }, { fcmToken: fcmToken }, { new: true });
            }
            return res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    pic: user.pic,
                    fcmToken: fcmToken,
                    token: generateToken(user._id)
                },
                notification: user.notification
            })
        } else {
            return res.status(403).json("Invalid Email or Password");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something Went Wrong");
    }
}

export const allUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select("name email pic");

    res.json(users);
}

export const getNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const notifications = user.notification

        // console.log("new notifications : ", notifications);
        res.status(200).json(notifications);

    } catch (err) {
        console.log(err);
        res.status(401);
    }
}

export const saveNotification = async (req, res) => {
    const { message } = req.body;

    console.log("saving notifi : ", message)
    try {
        const user = await User.findById(req.user._id);
        let notifications = user.notification;

        const existedMessage = notifications.find(n => n.chat._id === message.chat._id);

        if (!existedMessage) {
            notifications.unshift(message);

            const savedNotification = await User.findByIdAndUpdate(req.user._id, { notification: notifications }, { new: true });

            res.json({ success: true });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json("Error Saving Notification");
    }

}

export const removeNotification = async (req, res) => {
    const { chatId } = req.body;

    try {
        const chat = await Chat.findById(chatId);
        const user = await User.findById(req.user._id);

        const notifications = user.notification;
        console.log("notificaons : ", notifications);
        let removedNotifications = notifications.filter(n => String(n.chat._id) !== String(chat._id));



        console.log("removed notificaitions : ", removedNotifications)

        const savedNotification = await User.findByIdAndUpdate(req.user._id, { notification: removedNotifications }, { new: true });

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json("Error Saving Notification");
    }

}

export const saveFCMToken = async (req, res) => {
    try {
        const { fcmToken } = req.body;

        const user = await User.findByIdAndUpdate(req.user._id, { fcmToken: fcmToken }, { new: true });

        res.status(200).json({
            fcmToken: user.fcmToken
        })

    } catch (err) {
        console.log(err);
        res.status(400);
    }
}
