
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/rooms";

function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    roomNumber: "",
    capacity: 4,
    occupied: 0,
    monthlyFee: 5000
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load rooms");
      }

      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
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
          capacity: Number(form.capacity),
          occupied: Number(form.occupied),
          monthlyFee: Number(form.monthlyFee)
        })
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || "Unable to add room");
      }

      setMessage("Room added successfully!");

      setForm({
        roomNumber: "",
        capacity: 4,
        occupied: 0,
        monthlyFee: 5000
      });

      await fetchRooms();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Do you want to permanently delete this room?")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Unable to delete room");
      }

      setMessage("Room deleted successfully!");
      await fetchRooms();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Room Management</h1>
      <p>Add rooms and view room availability.</p>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="roomNumber"
          placeholder="Room Number"
          value={form.roomNumber}
          onChange={handleChange}
          required
        />

        <input
          name="capacity"
          type="number"
          min="1"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          required
        />

        <input
          name="occupied"
          type="number"
          min="0"
          max={form.capacity}
          placeholder="Occupied Beds"
          value={form.occupied}
          onChange={handleChange}
          required
        />

        <input
          name="monthlyFee"
          type="number"
          min="0"
          placeholder="Monthly Fee"
          value={form.monthlyFee}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Room</button>
      </form>

      <h2>Room List ({rooms.length})</h2>
      <button onClick={fetchRooms}>Refresh Rooms</button>

      {loading ? (
        <p>Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
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
              <th>ID</th>
              <th>Room</th>
              <th>Capacity</th>
              <th>Occupied</th>
              <th>Monthly Fee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.roomNumber}</td>
                <td>{room.capacity}</td>
                <td>{room.occupied}</td>
                <td>₹{room.monthlyFee}</td>
                <td>{room.status}</td>
                <td>
                  <button onClick={() => handleDelete(room.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RoomManagement;
