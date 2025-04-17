const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Trying to connect to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

mongoose.set("debug", true);

module.exports = connectDB;

