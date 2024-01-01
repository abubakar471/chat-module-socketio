import User from "../models/userModel.js";
import { generateToken } from "../config/generateToken.js";
import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export const SignUp = async (req, res) => {
    const { name, email, password, pic } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    const userExists = await User.findOne({ email: email })

    if (userExists) {
        res.status(400);
        throw new Error("User already exists!");
    }

    const user = new User({
        name, email, password, pic
    });

    const savedUser = await user.save();

    if (savedUser) {
        res.status(201).json({
            _id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            pic: savedUser.pic,
            token: generateToken(savedUser._id)
        })
    } else {
        res.status(400);
        throw new Error("Failed to create new user!");
    }
}

export const authUser = async (req, res) => {
    const { email, password, fcmToken } = req.body;

    const user = await User.findOne({ email: email });

    console.log("fcm_token : ", fcmToken);

    if (user && (await user.matchPassword(password))) {
        if (fcmToken) {
            const updateToken = await User.findOneAndUpdate({ email: email }, { fcmToken: fcmToken }, { new: true });
        }
        res.json({
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
        res.status(401);
        throw new Error("Invalid Email or Password");
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
    const { messageId } = req.body;

    try {
        const user = await User.findById(req.user._id);
        const notifications = user.notification;
        let removedNotifications = notifications.filter(n => n._id !== messageId);

        console.log("removed notifications tray : ", removedNotifications);
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
