const Task = require("../models/task");

exports.setReminder = async (req, res) => {
  const { taskId, reminderTime } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.reminderTime = new Date(reminderTime);
    await task.save();

    res.status(200).json({ message: "Reminder set successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error setting reminder", error });
  }
};

exports.getUpcomingReminders = async (req, res) => {
  const now = new Date();
  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

  try {
    const tasks = await Task.find({
      reminderTime: { $gte: now, $lte: inOneHour },
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reminders", error });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    console.log("✅ Incoming Request Body:", req.body); 

    const { title, dueDate, priority, completed, reminderTime, userEmail, reminderType, userPhoneNumber } = req.body;

    console.log("🔹 Title:", title);
    console.log("🔹 Due Date:", dueDate);
    console.log("🔹 Priority:", priority);
    console.log("🔹 Completed Status:", completed);

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (reminderType === 'whatsapp' && !userPhoneNumber) {
      return res.status(400).json({ error: 'Phone number is required for WhatsApp reminders' });
    }
    

    const task = new Task({
      title,
      completed: completed === true || completed === "true",
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      user: req.userId,
      reminderTime,
      userEmail,
      userPhoneNumber,
      reminderType,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, dueDate, priority, completed, reminderTime } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, dueDate, priority, completed },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

