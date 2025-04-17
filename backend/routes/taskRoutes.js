const express = require("express");
const router = express.Router();

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  setReminder,
  getUpcomingReminders
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getTasks);

router.get("/:id", authMiddleware, getTaskById);

router.post("/", authMiddleware, createTask);

router.put("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

router.post("/setReminder", authMiddleware, setReminder);

router.get("/upcomingReminders", authMiddleware, getUpcomingReminders);

module.exports = router;

router.post("/tasks", async (req, res) => {
  try {
    console.log("Received Data:", req.body); 
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Error saving task" });
  }
});


