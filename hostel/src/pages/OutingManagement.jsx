import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/api/outings";

function OutingManagement() {
  const [outings, setOutings] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    studentId: "",
    reason: "",
    outingDate: "",
    returnDate: ""
  });

  async function loadOutings() {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Unable to load outing requests");
      }

      const data = await response.json();
      setOutings(data);
    } catch (error) {
      setMessage("Cannot connect to backend. Check Spring Boot.");
    }
  }

  useEffect(() => {
    loadOutings();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function submitRequest(event) {
    event.preventDefault();
    setMessage("");

    if (new Date(form.returnDate) <= new Date(form.outingDate)) {
      setMessage("Return date must be after outing date.");
      return;
    }

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          studentId: Number(form.studentId),
          outingDate: form.outingDate,
          returnDate: form.returnDate
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Request failed");
      }

      setMessage("Outing request submitted successfully!");
      setForm({
        studentId: "",
        reason: "",
        outingDate: "",
        returnDate: ""
      });

      await loadOutings();
    } catch (error) {
      setMessage(error.message || "Unable to submit request.");
    }
  }

  async function updateStatus(id, status) {
    const remark = window.prompt("Enter warden remark:") || "";

    try {
      const response = await fetch(`${API}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          wardenRemark: remark
        })
      });

      if (!response.ok) {
        throw new Error("Unable to update request");
      }

      setMessage(`Request ${status.toLowerCase()} successfully.`);
      await loadOutings();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteRequest(id) {
    if (!window.confirm("Delete this outing request?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Unable to delete request");
      }

      setMessage("Outing request deleted.");
      await loadOutings();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div style={{ padding: "24px", fontFamily: "Arial" }}>
      <h2>Outing Request Management</h2>

      {message && <p>{message}</p>}

      <form
        onSubmit={submitRequest}
        style={{
          maxWidth: "500px",
          display: "grid",
          gap: "12px",
          marginBottom: "30px"
        }}
      >
        <input
          type="number"
          name="studentId"
          placeholder="Student ID"
          value={form.studentId}
          onChange={handleChange}
          min="1"
          required
        />

        <input
          type="text"
          name="reason"
          placeholder="Reason for outing"
          value={form.reason}
          onChange={handleChange}
          required
        />

        <label>
          Outing date and time
          <input
            type="datetime-local"
            name="outingDate"
            value={form.outingDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Return date and time
          <input
            type="datetime-local"
            name="returnDate"
            value={form.returnDate}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Submit Outing Request</button>
      </form>

      <h3>All Outing Requests</h3>

      <div style={{ overflowX: "auto" }}>
        <table
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            minWidth: "750px"
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Student ID</th>
              <th>Reason</th>
              <th>Outing</th>
              <th>Return</th>
              <th>Status</th>
              <th>Warden Remark</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {outings.map((outing) => (
              <tr key={outing.id}>
                <td>{outing.id}</td>
                <td>{outing.studentId}</td>
                <td>{outing.reason}</td>
                <td>
                  {outing.outingDate
                    ? new Date(outing.outingDate).toLocaleString()
                    : ""}
                </td>
                <td>
                  {outing.returnDate
                    ? new Date(outing.returnDate).toLocaleString()
                    : ""}
                </td>
                <td>{outing.status}</td>
                <td>{outing.wardenRemark || "-"}</td>
                <td>
                  <button
                    onClick={() => updateStatus(outing.id, "APPROVED")}
                    disabled={outing.status === "APPROVED"}
                  >
                    Approve
                  </button>{" "}
                  <button
                    onClick={() => updateStatus(outing.id, "REJECTED")}
                    disabled={outing.status === "REJECTED"}
                  >
                    Reject
                  </button>{" "}
                  <button onClick={() => deleteRequest(outing.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {outings.length === 0 && (
              <tr>
                <td colSpan="8">No outing requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OutingManagement;
