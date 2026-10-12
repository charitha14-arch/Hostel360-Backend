import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/api/wardens";

function WardenManagement() {
  const [wardens, setWardens] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    assignedBlock: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadWardens = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error();
      setWardens(await response.json());
    } catch {
      setMessage("Cannot connect to backend. Check Spring Boot.");
    }
  };

  useEffect(() => {
    loadWardens();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unable to save warden.");
      }

      setMessage(editingId ? "Warden updated!" : "Warden added!");
      setForm({ name: "", email: "", phone: "", assignedBlock: "" });
      setEditingId(null);
      await loadWardens();
    } catch (error) {
      setMessage(error.message || "Could not save warden.");
    }
  };

  const editWarden = (warden) => {
    setForm({
      name: warden.name || "",
      email: warden.email || "",
      phone: warden.phone || "",
      assignedBlock: warden.assignedBlock || ""
    });
    setEditingId(warden.id);
    setMessage("");
  };

  const deleteWarden = async (id) => {
    if (!window.confirm("Are you sure you want to delete this warden?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Unable to delete warden.");

      setMessage("Warden deleted.");
      await loadWardens();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", email: "", phone: "", assignedBlock: "" });
    setMessage("");
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Warden Management</h1>
      <p>Add, view, update, and delete warden details.</p>

      {message && <p>{message}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "25px"
        }}
      >
        <input
          name="name"
          placeholder="Warden name"
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
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          name="assignedBlock"
          placeholder="Assigned block"
          value={form.assignedBlock}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update Warden" : "Add Warden"}
        </button>

        {editingId && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <h2>Warden List</h2>

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
              <th>Assigned Block</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {wardens.map((warden) => (
              <tr key={warden.id}>
                <td>{warden.id}</td>
                <td>{warden.name}</td>
                <td>{warden.email}</td>
                <td>{warden.phone}</td>
                <td>{warden.assignedBlock}</td>
                <td>
                  <button onClick={() => editWarden(warden)}>
                    Edit
                  </button>{" "}
                  <button onClick={() => deleteWarden(warden.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {wardens.length === 0 && (
              <tr>
                <td colSpan="6">No wardens found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WardenManagement;