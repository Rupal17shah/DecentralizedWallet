const User = require("../models/user");

const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

const checkRoles = (roles) => async (req, res, next) => {
  let { name } = req.body;

  const user = await User.findOne({ name });
  roles.includes(user.role)
    ? next()
    : res
      .status(401)
      .json({ message: "Sorry you do not have access to this route" });
};

module.exports = { verifyToken, checkRoles };
