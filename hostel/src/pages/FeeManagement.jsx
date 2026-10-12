
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/fees";

function FeeManagement() {
  const [fees, setFees] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    amount: "",
    dueDate: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchFees = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load fees");
      }

      const data = await response.json();
      setFees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
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
          studentId: Number(form.studentId),
          amount: Number(form.amount),
          dueDate: form.dueDate
        })
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || "Unable to add fee");
      }

      setMessage("Fee added successfully!");
      setForm({ studentId: "", amount: "", dueDate: "" });
      await fetchFees();
    } catch (err) {
      setError(err.message);
    }
  };

  const markPaid = async (id) => {
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}/pay`, {
        method: "PUT"
      });

      if (!response.ok) {
        throw new Error("Unable to update payment status");
      }

      setMessage("Fee marked as paid!");
      await fetchFees();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteFee = async (id) => {
    if (!window.confirm("Permanently delete this fee record?")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Unable to delete fee");
      }

      setMessage("Fee deleted successfully!");
      await fetchFees();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Fee Management</h1>
      <p>Manage student hostel fees and payment status.</p>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Add Fee</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="studentId"
          type="number"
          min="1"
          placeholder="Student ID"
          value={form.studentId}
          onChange={handleChange}
          required
        />

        <input
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Fee</button>
      </form>

      <h2>Fee Records ({fees.length})</h2>
      <button onClick={fetchFees}>Refresh Fees</button>

      {loading ? (
        <p>Loading fees...</p>
      ) : fees.length === 0 ? (
        <p>No fee records found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            border="1"
            cellPadding="10"
            style={{
              marginTop: "20px",
              borderCollapse: "collapse",
              width: "100%"
            }}
          >
            <thead>
              <tr>
                <th>Fee ID</th>
                <th>Student ID</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {fees.map((fee) => (
                <tr key={fee.id}>
                  <td>{fee.id}</td>
                  <td>{fee.studentId}</td>
                  <td>₹{fee.amount}</td>
                  <td>{fee.dueDate}</td>
                  <td>{fee.status}</td>
                  <td>{fee.paymentDate || "-"}</td>
                  <td>
                    {fee.status !== "PAID" && (
                      <button onClick={() => markPaid(fee.id)}>
                        Mark Paid
                      </button>
                    )}
                    {" "}
                    <button onClick={() => deleteFee(fee.id)}>
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

export default FeeManagement;
