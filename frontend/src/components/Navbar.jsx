// Navbar.js
import React from "react";
import "./Navbar.css";

const Navbar = ({ tasks }) => {
  const handleExport = () => {
    const csvData = convertTasksToCSV(tasks);
    downloadCSV(csvData, "tasks.csv");
  };

  const convertTasksToCSV = (taskList) => {
    if (!taskList || taskList.length === 0) {
      return "";
    }

    const headers = Object.keys(taskList[0]).join(",");
    const rows = taskList.map((task) => Object.values(task).join(",")).join("\n");

    return `${headers}\n${rows}`;
  };

  const downloadCSV = (data, filename) => {
    const csvFile = new Blob([data], { type: "text/csv;charset=utf-8;" });
    const downloadLink = document.createElement("a");

    downloadLink.href = URL.createObjectURL(csvFile);
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="navbar">
      <div>ALL TASKS</div>
      <div className="export-button-container">
        <button onClick={handleExport}>Export</button>
      </div>
    </div>
  );
};

export default Navbar;