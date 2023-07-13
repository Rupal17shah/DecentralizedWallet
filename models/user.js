const { Schema, model } = require("mongoose");
const User = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["node", "miner"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// module.exports = model("User", user);
module.exports =  model("user",User);
