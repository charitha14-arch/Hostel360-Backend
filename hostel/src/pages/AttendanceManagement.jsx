import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/api/attendance";

function AttendanceManagement() {
  const [records, setRecords] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState("PRESENT");
  const [message, setMessage] = useState("");

  const loadAttendance = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Unable to load attendance");
      setRecords(await response.json());
    } catch {
      setMessage("Cannot connect to backend. Check Spring Boot.");
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const markAttendance = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: Number(studentId),
          attendanceDate,
          status
        })
      });

      if (!response.ok) {
        throw new Error("Could not mark attendance. Check student ID and duplicate records.");
      }

      setMessage("Attendance marked successfully!");
      setStudentId("");
      await loadAttendance();
    } catch (error) {
      setMessage(error.message || "Backend connection failed.");
    }
  };

  const deleteAttendance = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Delete failed");

      setMessage("Attendance record deleted.");
      await loadAttendance();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Attendance Management</h1>
      <p>Mark and view student attendance.</p>

      {message && <p>{message}</p>}

      <form
        onSubmit={markAttendance}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "24px"
        }}
      >
        <input
          type="number"
          min="1"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />

        <input
          type="date"
          value={attendanceDate}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setAttendanceDate(e.target.value)}
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="PRESENT">Present</option>
          <option value="ABSENT">Absent</option>
        </select>

        <button type="submit">Mark Attendance</button>
        <button type="button" onClick={loadAttendance}>
          Refresh
        </button>
      </form>

      <h2>Attendance Records</h2>

      <div style={{ overflowX: "auto" }}>
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Student ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.studentId}</td>
                <td>{record.attendanceDate}</td>
                <td>{record.status}</td>
                <td>
                  <button onClick={() => deleteAttendance(record.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td colSpan="5">No attendance records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceManagement;