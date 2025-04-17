import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import "./Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [formVisible, setFormVisible] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchTasks();
    }
  }, [navigate]);

  useEffect(() => {
    const timeouts = [];
    tasks.forEach((task) => {
      if (task.reminderTime) {
        const reminderTime = new Date(task.reminderTime).getTime();
        const currentTime = new Date().getTime();
        const timeUntilReminder = reminderTime - currentTime;

        if (timeUntilReminder > 0) {
          const newTimeout = setTimeout(() => {
            alert(`Reminder: ${task.title}`);
          }, timeUntilReminder);
          timeouts.push(newTimeout);
        }
      }
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPriorityFilter("");
  };

  const handlePriorityChange = (priority) => {
    setPriorityFilter(priority);
    setFilter("");
  };

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setFormVisible(false); 
  };

  const filteredTasks = tasks.filter((task) => {
    const titleMatch = task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const notesMatch = task.notes && task.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || descriptionMatch || notesMatch;

    if (priorityFilter) return task.priority === priorityFilter && matchesSearch;
    if (filter === "pending") return !task.completed && matchesSearch;
    if (filter === "completed") return task.completed && matchesSearch;
    return matchesSearch;
  });

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="dashboard-container">
      <Sidebar
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onPriorityChange={handlePriorityChange}
        pendingTaskCount={pendingTasks.length}
        completedTaskCount={completedTasks.length}
      />
      <div className="main-content">
        <Navbar tasks={tasks} />

        <button
          onClick={() => setFormVisible(!formVisible)}
          style={{
            marginBottom: "10px",
            padding: "8px 16px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {formVisible ? "Hide Task Form(For TaskList) ▲" : "Show Task Form ▼"}
        </button>

        {formVisible && <TaskForm onTaskAdded={fetchTasks} />}

        <TaskList tasks={filteredTasks} filter={filter} onTaskUpdated={fetchTasks} />
      </div>
    </div>
  );
}

export default Dashboard;
