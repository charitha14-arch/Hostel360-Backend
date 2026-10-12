
import React, { useEffect, useState } from "react";
import "./Complaints.css";

const API_URL = "http://localhost:8080/api/complaints";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    category: "Maintenance",
    title: "",
    description: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load complaints");
      }

      const data = await response.json();
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          studentId: Number(form.studentId)
        })
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || "Unable to submit complaint");
      }

      setMessage("Complaint submitted successfully!");

      setForm({
        studentId: "",
        category: "Maintenance",
        title: "",
        description: ""
      });

      await fetchComplaints();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStatus = async (id, status) => {
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || "Unable to update status");
      }

      setMessage("Complaint status updated!");
      await fetchComplaints();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm("Permanently delete this complaint?")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Unable to delete complaint");
      }

      setMessage("Complaint deleted successfully!");
      await fetchComplaints();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="complaints-page">
      <h1>Complaint Management</h1>
      <p>Submit and track hostel complaints.</p>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <section className="complaint-card">
        <h2>Submit a Complaint</h2>

        <form onSubmit={handleSubmit} className="complaint-form">
          <label>
            Student ID
            <input
              name="studentId"
              type="number"
              min="1"
              value={form.studentId}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Category
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option>Maintenance</option>
              <option>Cleaning</option>
              <option>Water Supply</option>
              <option>Electricity</option>
              <option>Food</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Complaint Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength="150"
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              maxLength="2000"
              required
            />
          </label>

          <button type="submit">Submit Complaint</button>
        </form>
      </section>

      <section className="complaint-card">
        <div className="complaint-heading">
          <h2>All Complaints ({complaints.length})</h2>
          <button type="button" onClick={fetchComplaints}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          <div className="complaint-table-wrapper">
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Category</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>{complaint.id}</td>
                    <td>{complaint.studentId}</td>
                    <td>{complaint.category}</td>
                    <td>{complaint.title}</td>
                    <td>{complaint.description}</td>
                    <td>
                      <span className="complaint-status">
                        {complaint.status}
                      </span>
                    </td>
                    <td>
                      {complaint.createdAt
                        ? new Date(complaint.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      <select
                        aria-label={`Status for complaint ${complaint.id}`}
                        value={complaint.status}
                        onChange={(event) =>
                          updateStatus(complaint.id, event.target.value)
                        }
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => deleteComplaint(complaint.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Complaints;
