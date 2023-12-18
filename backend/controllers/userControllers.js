import User from "../models/userModel.js";
import { generateToken } from "../config/generateToken.js";

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
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
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
