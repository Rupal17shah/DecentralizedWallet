const mongoose = require("mongoose");
const URI=process.env.MONGODB_URI || "mongodb://localhost:27017/blockstream";
const connectDB = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error("MongoDB connection FAIL");
  }
};
module.exports = connectDB;