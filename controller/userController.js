const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signupUser = async (req, res) => {
  try {
    var { name, email, password, role } = req.body;
    //getting the user by name if any
    // console.log(role);
    const validEmail = async (email) => {
      let users = await User.findOne({ email });
      return users ? false : true;
    };

    //hashing the password
    password = await bcrypt.hash(password, 10);
    //creating the user
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    return res.status(200).json({ message: "User Created! Now you can login" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const nodes = async (req, res) => {
  try {
    let users = await User.find();
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const loginUser = async (req, res) => {
  let users = await User.findOne({ email: req.body.email });
  if (!users) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    let match = await bcrypt.compare(req.body.password, users.password);
    if (match) {
      const accessToken = jwt.sign(
        users.toJSON(),
        process.env.ACCESS_TOKEN_SECRET,
      );
      return res.status(200).json({
        accessToken: accessToken,
        user: users,
      });
    } else {
      return res.status(401).json({ message: "Wrong Password" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    req.session.destroy();
    return res.status(200).json({ message: "User Logged out" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { signupUser, loginUser, logoutUser,nodes };
