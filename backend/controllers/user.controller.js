const User = require("../models/user.model");
const { use } = require("../routes/user.route");
const generateToken = require("../utils/createToken");
const bcrypt = require("bcrypt");
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res
        .status(400)
        .json({ message: "User already exists", status: false });
    }
    let existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "Username already taken", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Store hashed password
    });
    await newUser.save();
    const token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: true, // Only accessible by
    });

    delete newUser.password;
    return res.status(201).json({
      message: "User created successfully",
      status: true,
      user: newUser,
    });
  } catch (Err) {
    next();
    console.log("Error while signining up", Err.message);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", status: false });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true, // Only accessible by
    });

    delete user.password;

    return res
      .status(200)
      .json({ message: "Login successful", status: true, user: user });
  } catch (err) {
    console.log("Error while logging in", err.message);
    next(err);
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error while logging out:", err.message);
    return res.status(500).json({ message: "Failed to logout" });
  }
};

module.exports = {
  signup,
  login,
  logout,
};
