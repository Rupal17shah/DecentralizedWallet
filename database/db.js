const mongoose = require("mongoose");
const URI = process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/blockstream";
const connectDB = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error(error);
  }
};
module.exports = connectDB;