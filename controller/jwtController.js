const User = require("../models/user");
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
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
