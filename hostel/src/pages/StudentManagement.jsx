
import React, { useEffect, useState } from "react";
import "./StudentManagement.css";

const API_URL = "http://localhost:8080/api/students";

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    roomNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load students from Spring Boot
  const fetchStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      console.log("Students received from backend:", data);

      if (!Array.isArray(data)) {
        throw new Error("Backend did not return a student list.");
      }

      setStudents(data);
    } catch (err) {
      console.error("Error loading students:", err);
      setError(err.message || "Unable to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle form input
  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // Add student to database
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Failed to add student (${response.status})`
        );
      }

      const savedStudent = await response.json();

      setForm({
        name: "",
        email: "",
        phone: "",
        roomNumber: "",
      });

      setMessage("Student added successfully!");

      // Refresh the list from the backend
      await fetchStudents();

      console.log("Saved student:", savedStudent);
    } catch (err) {
      console.error("Error adding student:", err);
      setError(err.message || "Unable to add student.");
    }
  };

  // Delete student from database
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Permanently delete this student?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to delete student (${response.status})`
        );
      }

      setStudents((previous) =>
        previous.filter((student) => student.id !== id)
      );

      setMessage("Student deleted successfully!");
    } catch (err) {
      console.error("Error deleting student:", err);
      setError(err.message || "Unable to delete student.");
    }
  };

  return (
    <div className="student-page">
      <h1>Student Management</h1>
      <p>Manage your Hostel360 student records.</p>

      {message && (
        <p role="status" className="success-message">
          {message}
        </p>
      )}

      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}

      <form className="student-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Student Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          name="roomNumber"
          placeholder="Room Number"
          value={form.roomNumber}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Student</button>
      </form>

      <div className="student-list-header">
        <h2>Student List ({students.length})</h2>

        <button type="button" onClick={fetchStudents}>
          Refresh List
        </button>
      </div>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found in the database.</p>
      ) : (
        <div className="student-table-wrapper">
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Room</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.roomNumber}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDelete(student.id)}
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
    </div>
  );
}

export default StudentManagement;
