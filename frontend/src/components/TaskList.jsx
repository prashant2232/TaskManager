// TaskList.js
import React, { useState } from "react";
import axios from "axios";
import "./TaskList.css"; 

const TaskList = ({ tasks, filter, onTaskUpdated }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newCompleted, setNewCompleted] = useState(false);

  const handleEdit = (task) => {
    setEditingTask(task._id);
    setNewTitle(task.title);
    setNewDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setNewPriority(task.priority);
    setNewCompleted(task.completed);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { title: newTitle, dueDate: newDueDate, priority: newPriority, completed: newCompleted },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEditingTask(null);
      onTaskUpdated();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onTaskUpdated();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    if (filter === "today") {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        return (dueDate >= todayStart && dueDate <= todayEnd) || (dueDate < todayStart && !task.completed);
      }
      return false;
    }
    return true; 
  });

  return (
    <div className="task-list-container"> 
      {filteredTasks.map((task) => (
        <div key={task._id} className="task-card">
          {editingTask === task._id ? (
            <>
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
              <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                <option value="High">🔥 High</option>
                <option value="Medium">⚡ Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
              <select value={newCompleted} onChange={(e) => setNewCompleted(e.target.value === "true")}>
                <option value="false">⏳ Pending</option>
                <option value="true">✅ Completed</option>
              </select>
              <button onClick={() => handleUpdate(task._id)}>Save</button>
              <button onClick={() => setEditingTask(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{task.title}</h3>
              <p>📅 {task.dueDate ? task.dueDate.split("T")[0] : "No Due Date"}</p>
              <p>🔥 {task.priority}</p>
              <p>{task.completed ? "✅ Completed" : "⏳ Pending"}</p>
              <div className="edit-delete-buttons">
                <button onClick={() => handleEdit(task)}>✏️ Edit</button>
                <button onClick={() => handleDelete(task._id)}>❌ Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;



