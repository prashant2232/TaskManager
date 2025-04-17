import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ onFilterChange, pendingTaskCount, completedTaskCount, todayTaskCount, onSearch }) => {
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleTasksDropdown = () => {
    setIsTasksOpen(!isTasksOpen);
  };

  const handleFilterClick = (filterType) => {
    onFilterChange(filterType);
    setIsTasksOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTasksOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTodayClick = () => {
    onFilterChange("today");
  };

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    if (onSearch) {
      onSearch(newSearchTerm);
    }
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src="/assets/weblogo.png" alt="TaskManager Logo" className="logo-image" />
      </div>

      <div className="search-container">
        <FontAwesomeIcon icon={faSearch} className="search-logo" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="task-list">
        <div className="task dropdown-toggle" onClick={toggleTasksDropdown}>
          📋 All tasks
          <span className="dropdown-arrow">{isTasksOpen ? '▲' : '▼'}</span>
        </div>
        {isTasksOpen && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <div className="task active" onClick={() => handleFilterClick("all")}>
              📋 All tasks ({pendingTaskCount + completedTaskCount})
            </div>
            <div className="task" onClick={() => handleFilterClick("pending")}>
              ⏳ Pending ({pendingTaskCount})
            </div>
            <div className="task" onClick={() => handleFilterClick("completed")}>
              ✅ Completed ({completedTaskCount})
            </div>
          </div>
        )}
        <div className="task" onClick={handleTodayClick}>📅 Today ({todayTaskCount})</div>
      </div>
      <div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <footer>
        <a href="#">Pricing</a> • <a href="#">Support</a> • <a href="#">Terms</a> • <a href="#">Privacy</a>
      </footer>
    </div>
  );
};

export default Sidebar;

