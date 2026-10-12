import React, { useEffect, useState } from "react";
import "./CleaningManagement.css";
const API = "http://localhost:8080/api/cleaning";

function CleaningManagement() {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [form, setForm] = useState({
    roomNumber: "",
    assignedTo: "",
    cleaningDate: "",
    remarks: ""
  });

  async function loadTasks() {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Unable to load cleaning tasks");
      }

      setTasks(await response.json());
    } catch (error) {
      setMessage("Cannot connect to backend. Check Spring Boot.");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function createTask(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          assignedTo: form.assignedTo || null,
          remarks: form.remarks || null
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setMessage("Cleaning task created successfully!");

      setForm({
        roomNumber: "",
        assignedTo: "",
        cleaningDate: "",
        remarks: ""
      });

      await loadTasks();
    } catch (error) {
      setMessage(error.message || "Unable to create task.");
    }
  }

  async function updateTask(id, changes) {
    const task = tasks.find(item => item.id === id);
    if (!task) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: task.status,
          assignedTo: task.assignedTo,
          cleaningDate: task.cleaningDate,
          remarks: task.remarks,
          ...changes
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setMessage("Cleaning task updated successfully.");
      await loadTasks();
    } catch (error) {
      setMessage(error.message || "Unable to update task.");
    }
  }

  async function deleteTask(id) {
    if (!window.confirm("Delete this cleaning task?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Unable to delete cleaning task.");
      }

      setMessage("Cleaning task deleted.");
      await loadTasks();
    } catch (error) {
      setMessage(error.message);
    }
  }

  const filteredTasks =
    filter === "ALL"
      ? tasks
      : tasks.filter(task => task.status === filter);

  const pending = tasks.filter(
    task => task.status === "PENDING"
  ).length;

  const inProgress = tasks.filter(
    task => task.status === "IN_PROGRESS"
  ).length;

  const completed = tasks.filter(
    task => task.status === "COMPLETED"
  ).length;

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    padding: "8px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "3px"
  };

  return (
    <div className="cleaning-page">
      <h2>Room Cleaning Management</h2>
      <p>Assign and monitor hostel room cleaning tasks.</p>

      {message && (
        <p role="status" className="cleaning-message">
          {message}
        </p>
      )}

      <div className="cleaning-summary">
        <div>
          <h3>{tasks.length}</h3>
          <p>Total Tasks</p>
        </div>
        <div>
          <h3>{pending}</h3>
          <p>Pending</p>
        </div>
        <div>
          <h3>{inProgress}</h3>
          <p>In Progress</p>
        </div>
        <div>
          <h3>{completed}</h3>
          <p>Completed</p>
        </div>
      </div>

      <section className="cleaning-card">
        <h3>Create Cleaning Task</h3>

        <form className="cleaning-form" onSubmit={createTask}>
          <label>
            Room Number
            <input
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleChange}
              placeholder="Example: 101"
              style={inputStyle}
              required
            />
          </label>

          <label>
            Assigned Staff
            <input
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              placeholder="Staff name"
              style={inputStyle}
            />
          </label>

          <label>
            Cleaning Date
            <input
              type="date"
              name="cleaningDate"
              value={form.cleaningDate}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </label>

          <label>
            Remarks
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              placeholder="Additional instructions"
              style={inputStyle}
              rows="3"
            />
          </label>

          <button type="submit" className="cleaning-primary">
            Create Task
          </button>
        </form>
      </section>

      <section className="cleaning-card">
        <div className="cleaning-toolbar">
          <h3>Cleaning Tasks</h3>

          <select
            value={filter}
            onChange={event => setFilter(event.target.value)}
            aria-label="Filter cleaning tasks"
          >
            <option value="ALL">All Tasks</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <button type="button" onClick={loadTasks}>
            Refresh
          </button>
        </div>

        <div className="cleaning-table-wrap">
          <table className="cleaning-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Room</th>
                <th>Assigned Staff</th>
                <th>Date</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.roomNumber}</td>
                  <td>{task.assignedTo || "-"}</td>
                  <td>{task.cleaningDate || "-"}</td>
                  <td>
                    <span className="cleaning-status">
                      {task.status}
                    </span>
                  </td>
                  <td>{task.remarks || "-"}</td>
                  <td>
                    <select
                      aria-label={`Status for room ${task.roomNumber}`}
                      value={task.status}
                      onChange={event =>
                        updateTask(task.id, {
                          status: event.target.value
                        })
                      }
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>

                    <button
                      type="button"
                      style={buttonStyle}
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan="7">No cleaning tasks found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default CleaningManagement;
