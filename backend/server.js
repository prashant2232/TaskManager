const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const Task = require("./models/task");
require("./reminderScheduler");



dotenv.config();

const app = express();


app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",  
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,  
}));


const taskRoutes = require("./routes/taskRoutes");  
const userRoutes = require("./routes/userRoutes");

app.use("/api/tasks", taskRoutes); 
app.use("/api/users", userRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


