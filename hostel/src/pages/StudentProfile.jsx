import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/api/students";

function StudentProfile() {
  const [students, setStudents] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");

  const loadStudents = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Could not load students");
      setStudents(await response.json());
      setMessage("");
    } catch {
      setMessage("Unable to connect to backend. Check Spring Boot.");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const searchStudent = async (e) => {
    e.preventDefault();
    setSelectedStudent(null);
    setMessage("");

    try {
      const response = await fetch(`${API}/${searchId}`);

      if (response.status === 404) {
        setMessage("Student not found.");
        return;
      }

      if (!response.ok) throw new Error("Search failed");

      setSelectedStudent(await response.json());
    } catch {
      setMessage("Unable to search student. Check the backend.");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Student Profiles</h1>

      <form
        onSubmit={searchStudent}
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <input
          type="number"
          min="1"
          placeholder="Enter Student ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          required
        />
        <button type="submit">Search</button>
        <button
          type="button"
          onClick={() => {
            setSelectedStudent(null);
            setSearchId("");
            setMessage("");
          }}
        >
          Clear
        </button>
      </form>

      {message && <p>{message}</p>}

      {selectedStudent && (
        <div
          style={{
            padding: "20px",
            marginBottom: "20px",
            background: "#e0f2fe",
            borderRadius: "8px"
          }}
        >
          <h2>Student Details</h2>
          <p><strong>ID:</strong> {selectedStudent.id}</p>
          <p><strong>Name:</strong> {selectedStudent.name}</p>
          <p><strong>Email:</strong> {selectedStudent.email}</p>
          <p><strong>Phone:</strong> {selectedStudent.phone}</p>
          <p><strong>Room:</strong> {selectedStudent.roomNumber}</p>
        </div>
      )}

      <h2>All Students</h2>

      <div style={{ overflowX: "auto" }}>
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Room Number</th>
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
                    onClick={() => {
                      setSelectedStudent(student);
                      setSearchId(String(student.id));
                      setMessage("");
                    }}
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan="6">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentProfile;