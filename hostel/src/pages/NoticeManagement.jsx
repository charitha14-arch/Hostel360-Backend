import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/api/notices";

function NoticeManagement() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    postedBy: "Admin"
  });
  const [editingId, setEditingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const loadNotices = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error();
      setNotices(await response.json());
    } catch {
      setStatusMessage("Unable to connect to backend. Check Spring Boot.");
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

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
        throw new Error("Unable to save notice.");
      }

      setStatusMessage(editingId ? "Notice updated!" : "Notice published!");
      setForm({ title: "", message: "", postedBy: "Admin" });
      setEditingId(null);
      await loadNotices();
    } catch (error) {
      setStatusMessage(error.message || "Something went wrong.");
    }
  };

  const editNotice = (notice) => {
    setForm({
      title: notice.title || "",
      message: notice.message || "",
      postedBy: notice.postedBy || "Admin"
    });
    setEditingId(notice.id);
    setStatusMessage("");
  };

  const deleteNotice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Unable to delete notice.");

      setStatusMessage("Notice deleted.");
      await loadNotices();
    } catch (error) {
      setStatusMessage(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", message: "", postedBy: "Admin" });
    setStatusMessage("");
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Notices and Announcements</h1>
      <p>Publish important hostel announcements.</p>

      {statusMessage && <p>{statusMessage}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: "600px",
          marginBottom: "30px"
        }}
      >
        <input
          name="title"
          placeholder="Notice title"
          value={form.title}
          onChange={handleChange}
          maxLength="255"
          required
        />

        <textarea
          name="message"
          placeholder="Write your notice here"
          value={form.message}
          onChange={handleChange}
          maxLength="2000"
          rows="5"
          required
        />

        <input
          name="postedBy"
          placeholder="Posted by"
          value={form.postedBy}
          onChange={handleChange}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit">
            {editingId ? "Update Notice" : "Publish Notice"}
          </button>

          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Published Notices</h2>

      {notices.length === 0 && <p>No notices available.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px"
        }}
      >
        {notices.map((notice) => (
          <article
            key={notice.id}
            style={{
              background: "white",
              padding: "18px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              overflowWrap: "anywhere"
            }}
          >
            <h3>{notice.title}</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{notice.message}</p>
            <p>
              <strong>Posted by:</strong> {notice.postedBy || "Admin"}
            </p>
            <small>
              {notice.createdAt
                ? new Date(notice.createdAt).toLocaleString()
                : ""}
            </small>

            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button onClick={() => editNotice(notice)}>Edit</button>
              <button onClick={() => deleteNotice(notice.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default NoticeManagement;