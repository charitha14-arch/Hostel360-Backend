import React, { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

function AdminDashboard() {
  const [counts, setCounts] = useState({
    students: 0,
    rooms: 0,
    fees: 0,
    complaints: 0,
    outings: 0,
    attendance: 0,
    cleaning: 0,
    wardens: 0,
    notices: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const endpoints = [
      { key: "students", url: `${API}/students` },
      { key: "rooms", url: `${API}/rooms` },
      { key: "fees", url: `${API}/fees` },
      { key: "complaints", url: `${API}/complaints` },
      { key: "outings", url: `${API}/outings` },
      { key: "attendance", url: `${API}/attendance` },
      { key: "cleaning", url: `${API}/cleaning` },
      { key: "wardens", url: `${API}/wardens` },
      { key: "notices", url: `${API}/notices` }
    ];

    const loadDashboard = async () => {
      try {
        const results = await Promise.all(
          endpoints.map(async (item) => {
            const response = await fetch(item.url);
            if (!response.ok) {
              throw new Error(`Could not load ${item.key}`);
            }

            const data = await response.json();
            return [item.key, Array.isArray(data) ? data.length : 0];
          })
        );

        setCounts(Object.fromEntries(results));
        setError("");
      } catch {
        setError(
          "Some dashboard data could not be loaded. Check that Spring Boot is running and the APIs are available."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    { title: "Total Students", key: "students", color: "#2563eb" },
    { title: "Total Rooms", key: "rooms", color: "#0891b2" },
    { title: "Fee Records", key: "fees", color: "#16a34a" },
    { title: "Complaints", key: "complaints", color: "#ea580c" },
    { title: "Outing Requests", key: "outings", color: "#7c3aed" },
    { title: "Attendance Records", key: "attendance", color: "#0f766e" },
    { title: "Cleaning Tasks", key: "cleaning", color: "#ca8a04" },
    { title: "Wardens", key: "wardens", color: "#db2777" },
    { title: "Notices", key: "notices", color: "#475569" }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h1>Hostel360 Admin Dashboard</h1>
      <p>Overview of your hostel management system.</p>

      {loading && <p>Loading dashboard...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
          <br />
          Please verify your backend APIs.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "18px",
          marginTop: "24px"
        }}
      >
        {cards.map((card) => (
          <div
            key={card.key}
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              borderLeft: `5px solid ${card.color}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
          >
            <h3 style={{ marginTop: 0 }}>{card.title}</h3>
            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                marginBottom: 0,
                color: card.color
              }}
            >
              {loading ? "..." : counts[card.key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;