import { useState } from "react";
import axios from "axios";
import "./TaskForm.css";

function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [completed, setCompleted] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [reminderType, setReminderType] = useState("email");
  const [userPhoneNumber, setUserPhoneNumber] = useState("");

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title) return;
  
    try {
      let taskData = {
        title,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority,
        completed,
        reminderTime: reminderTime ? new Date(reminderTime).toISOString() : null,
        reminderType,
      };
  
     
      if (reminderType === "email") {
        taskData.userEmail = userEmail;
      } else if (reminderType === "whatsapp") {
        taskData.userPhoneNumber = userPhoneNumber;
      } else {
        taskData.userEmail = null;
        taskData.userPhoneNumber = null;
      }
  
      console.log("Sending Task to Backend:", taskData);
  
      
      await axios.post(
        "http://localhost:5000/api/tasks",
        taskData,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
  
      
      setTitle("");
      setDueDate("");
      setPriority("Medium");
      setCompleted(false);
      setReminderTime("");
      setUserEmail("");
      setReminderType("email");
      setUserPhoneNumber(""); 
      onTaskAdded(); 
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  
  return (
    <form onSubmit={handleAddTask}>
      <input
        type="text"
        placeholder="Enter task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <label style={{ fontWeight: "bold", display: "block", marginTop: "10px" }}>
        ⏰ Set a Reminder (Optional):
      </label>
      <input
        type="datetime-local"
        value={reminderTime}
        onChange={(e) => setReminderTime(e.target.value)}
      />

      <label style={{ fontWeight: "bold", display: "block", marginTop: "10px" }}>
        Choose Reminder Type:
      </label>
      <select value={reminderType} onChange={(e) => setReminderType(e.target.value)}>
        <option value="none">🚫 No Reminder</option>
        <option value="site">🔔 Site Notification</option>
        <option value="email">📧 Email</option>
        <option value="whatsapp">📱 WhatsApp</option>
      </select>

      {reminderType === "email" && (
        <>
          <label style={{ fontWeight: "bold", display: "block", marginTop: "10px" }}>
            Enter email for Reminders:
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </>
      )}

{reminderType === "whatsapp" && (
  <>
    <label style={{ fontWeight: "bold", display: "block", marginTop: "10px" }}>
      WhatsApp Number (e.g. +919876543210):
    </label>
    <input
      type="tel"
      placeholder="+91..."
      value={userPhoneNumber}
      onChange={(e) => setUserPhoneNumber(e.target.value)}
      required
    />

    <div style={{ backgroundColor: "#f9f9f9", border: "1px solid #ddd", padding: "10px", marginTop: "10px", borderRadius: "8px" }}>
      <p><strong>📲 To start receiving WhatsApp reminders:</strong></p>
      <ol style={{ paddingLeft: "20px", marginTop: "5px" }}>
        <li>Save <strong>+1 415 523 8886</strong> to your contacts</li>
        <li>Open WhatsApp and send the message: <code>join involved-church</code></li>
      </ol>
      <p style={{ fontSize: "12px", color: "#666" }}>
        (This is a one-time step required for Twilio's testing environment)
      </p>
    </div>
  </>
)}


      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="High">🔥 High</option>
        <option value="Medium">⚡ Medium</option>
        <option value="Low">🟢 Low</option>
      </select>

      <select value={completed ? "true" : "false"} onChange={(e) => setCompleted(e.target.value === "true")}>
        <option value="false">🕒 Pending</option>
        <option value="true">✅ Completed</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
