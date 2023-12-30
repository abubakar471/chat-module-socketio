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
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
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
    // try {
    //     const user = await User.findById(req.user._id)

    //     const notifications = user.notification;
    //     console.log(notifications)

    //     let nots = [];

    //     notifications.map((n) => {
    //         const findMessage = async () => {
    //             const message = await Message.findById(n).populate("sender chat");

    //             console.log(message)
    //         }

    //         findMessage()
    //     })



    //     console.log(nots);
    //     // console.log("notifications : ", user)

    // } catch (err) {
    //     console.log(err);
    //     res.status(401);
    // }

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
    // const { messageId, userId } = req.body;

    // try {
    //     const user = await User.findById(userId);
    //     const notifications = user.notification;
    //     notifications.unshift(messageId);

    //     const savedNotification = await User.findByIdAndUpdate(userId, { notification: notifications }, { new: true });

    //     res.json({ success: true });
    // } catch (err) {
    //     console.log(err);
    //     return res.status(400).json("Error Saving Notification");
    // }

    const { message } = req.body;

    try {
        const user = await User.findById(req.user._id);
        let notifications = user.notification;

        const existedMessage = notifications.find(n => n.chat._id === message.chat._id);

        console.log("exists : ", existedMessage);

        if (!existedMessage) {
            notifications.unshift(message);

            console.log("saving these notifs : ", notifications)

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
