import React, { useState } from "react";
import "./App.css";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentManagement from "./pages/StudentManagement";
import StudentProfile from "./pages/StudentProfile";
import RoomManagement from "./pages/RoomManagement";
import FeeManagement from "./pages/FeeManagement";
import Complaints from "./pages/Complaints";
import OutingManagement from "./pages/OutingManagement";
import CleaningManagement from "./pages/CleaningManagement";
import AttendanceManagement from "./pages/AttendanceManagement";
import WardenManagement from "./pages/WardenManagement";
import NoticeManagement from "./pages/NoticeManagement";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: "▦",
    roles: ["ADMIN", "WARDEN", "STUDENT"] },
  { id: "students", label: "Students", icon: "♟",
    roles: ["ADMIN", "WARDEN"] },
  { id: "profiles", label: "My Profile", icon: "◉",
    roles: ["STUDENT"] },
  { id: "profiles", label: "Student Profiles", icon: "◉",
    roles: ["ADMIN", "WARDEN"] },
  { id: "rooms", label: "Rooms", icon: "▤",
    roles: ["ADMIN", "WARDEN", "STUDENT"] },
  { id: "attendance", label: "Attendance", icon: "◷",
    roles: ["ADMIN", "WARDEN"] },
  { id: "fees", label: "Fees", icon: "₹",
    roles: ["ADMIN", "STUDENT"] },
  { id: "complaints", label: "Complaints", icon: "▧",
    roles: ["ADMIN", "WARDEN", "STUDENT"] },
  { id: "outings", label: "Outing Requests", icon: "⇢",
    roles: ["ADMIN", "WARDEN", "STUDENT"] },
  { id: "cleaning", label: "Room Cleaning", icon: "✳",
    roles: ["ADMIN", "WARDEN"] },
  { id: "wardens", label: "Wardens", icon: "♙",
    roles: ["ADMIN"] },
  { id: "notices", label: "Announcements", icon: "▤",
    roles: ["ADMIN", "WARDEN", "STUDENT"] },
];

const monthData = [
  { month: "Jan", joined: 9, left: 4 },
  { month: "Feb", joined: 15, left: 8 },
  { month: "Mar", joined: 12, left: 3 },
  { month: "Apr", joined: 15, left: 6 },
  { month: "May", joined: 20, left: 14 },
  { month: "Jun", joined: 18, left: 12 },
  { month: "Jul", joined: 12, left: 7 },
  { month: "Aug", joined: 24, left: 16 },
];

const sampleAttendance = [
  { name: "Bella", room: "101", checkin: "08:00 AM",
    checkout: "09:15 AM", status: "Active" },
  { name: "Georgia", room: "105", checkin: "07:30 AM",
    checkout: "10:50 AM", status: "Active" },
  { name: "Jesvita", room: "301", checkin: "—",
    checkout: "08:15 AM", status: "Inactive" },
  { name: "Georgia", room: "302", checkin: "—",
    checkout: "08:15 AM", status: "Inactive" },
];

function DashboardOverview({ user, role, onNavigate }) {
  const student = role === "STUDENT";
  const warden = role === "WARDEN";

  const stats = student
    ? [
        { label: "My Room", value: "101", icon: "▤", color: "blue" },
        { label: "My Complaints", value: "02", icon: "♧", color: "lime" },
        { label: "Outing Requests", value: "01", icon: "⇢", color: "purple" },
      ]
    : warden
    ? [
        { label: "Assigned Block", value: user.assignedBlock || "Not set",
          icon: "▤", color: "blue" },
        { label: "Open Complaints", value: "12", icon: "♧", color: "lime" },
        { label: "Students", value: "80", icon: "♟", color: "purple" },
      ]
    : [
        { label: "Vacant Rooms", value: "11/40", icon: "▤", color: "blue" },
        { label: "Open Complaints", value: "55", icon: "♧", color: "lime" },
        { label: "Total Students", value: "160", icon: "♟", color: "purple" },
      ];

  return (
    <div className="dashboard-content">
      <div className="welcome-line">
        <div>
          <h1>{student ? "My Dashboard" : warden ? "Warden Dashboard" : "Dashboard"}</h1>
          <p>
            Welcome back, {user.name || user.email}
          </p>
        </div>
        <span className="date-chip">
          {new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <section className="stats-grid">
        {stats.map((item) => (
          <button
            type="button"
            key={item.label}
            className={`stat-card ${item.color}`}
            onClick={() => {
              if (item.label.includes("Room")) onNavigate("rooms");
              else if (item.label.includes("Complaint")) onNavigate("complaints");
              else if (item.label.includes("Outing")) onNavigate("outings");
              else if (item.label.includes("Student")) onNavigate("students");
            }}
          >
            <span className="stat-icon">{item.icon}</span>
            <span className="stat-text">
              <span className="stat-label">{item.label}</span>
              <strong>{item.value}</strong>
            </span>
          </button>
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <h2>{student ? "Hostel Activity" : "Newly joined vs Left"}</h2>
              <p className="muted">Monthly overview</p>
            </div>
            <div className="chart-legend">
              <span><i className="legend-dot lime-dot" /> Joined</span>
              <span><i className="legend-dot purple-dot" /> Left</span>
            </div>
          </div>

          <div className="bar-chart">
            <div className="chart-y-labels">
              <span>25</span><span>20</span><span>15</span>
              <span>10</span><span>5</span><span>0</span>
            </div>
            <div className="chart-plot">
              {[25, 20, 15, 10, 5, 0].map((n) => (
                <div key={n} className="chart-gridline">
                  <span />
                </div>
              ))}
              <div className="bar-groups">
                {monthData.map((m) => (
                  <div className="bar-group" key={m.month}>
                    <div className="bar-pair">
                      <div
                        className="bar joined-bar"
                        style={{ height: `${(m.joined / 25) * 100}%` }}
                        title={`${m.joined} joined`}
                      />
                      <div
                        className="bar left-bar"
                        style={{ height: `${(m.left / 25) * 100}%` }}
                        title={`${m.left} left`}
                      />
                    </div>
                    <span className="bar-month">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="data-note">Illustrative chart data — connect your API for live figures.</p>
        </div>

        <div className="panel occupancy-panel">
          <div className="panel-heading">
            <h2>{student ? "Room Occupancy" : "Room status"}</h2>
          </div>
          <div className="donut-wrap">
            <div className="donut-chart">
              <div className="donut-hole" />
              <span className="donut-label label-top">35%</span>
              <span className="donut-label label-bottom">65%</span>
            </div>
          </div>
          <div className="donut-legend">
            <span><i className="legend-dot lime-dot" /> Occupied</span>
            <span><i className="legend-dot purple-dot" /> Vacant</span>
          </div>
        </div>

        <div className="panel attendance-panel">
          <div className="panel-heading">
            <div>
              <h2>{student ? "My Recent Activity" : "Attendance"}</h2>
              <p className="muted">Recent records</p>
            </div>
            {!student && (
              <button
                className="text-action"
                onClick={() => onNavigate("attendance")}
              >
                View all →
              </button>
            )}
          </div>

          {student ? (
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-symbol">✓</span>
                <div><strong>Room allocated</strong><p>Room details are available in your profile.</p></div>
              </div>
              <div className="activity-item">
                <span className="activity-symbol purple-symbol">↗</span>
                <div><strong>Outing requests</strong><p>Check the status of your requests.</p></div>
              </div>
              <div className="activity-item">
                <span className="activity-symbol">▤</span>
                <div><strong>Announcements</strong><p>View the latest hostel notices.</p></div>
              </div>
            </div>
          ) : (
            <div className="table-scroll">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Room no.</th>
                    <th>Check in</th>
                    <th>Check out</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleAttendance.map((item, index) => (
                    <tr key={`${item.name}-${index}`}>
                      <td>{item.name}</td>
                      <td>{item.room}</td>
                      <td>{item.checkin}</td>
                      <td>{item.checkout}</td>
                      <td>
                        <span className={`status ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="data-note">Sample records — replace with attendance API data.</p>
            </div>
          )}
        </div>

        <div className="panel finance-panel">
          <div className="finance-heading">
            <h2>{student ? "My Fees" : "Revenue overview"}</h2>
          </div>
          <div className="gauge-wrap">
            <div className="gauge">
              <div className="gauge-inner">
                <span>₹</span>
              </div>
            </div>
          </div>
          <div className="gauge-numbers">
            <span>{student ? "Fees" : "75%"}</span>
            <span>{student ? "Payment" : "25%"}</span>
          </div>
          <div className="donut-legend finance-legend">
            <span><i className="legend-dot lime-dot" /> Income</span>
            <span><i className="legend-dot purple-dot" /> Expenses</span>
          </div>
          <button className="finance-action" onClick={() => onNavigate("fees")}>
            {student ? "View my fees" : "View fee management"} →
          </button>
        </div>
      </section>

      <section className="quick-links">
        <h2>Quick access</h2>
        <div className="quick-links-grid">
          {(student
            ? [
                ["My Profile", "profiles", "◉"],
                ["Room Details", "rooms", "▤"],
                ["Submit Complaint", "complaints", "♧"],
                ["Request Outing", "outings", "⇢"],
                ["Announcements", "notices", "▣"],
              ]
            : warden
            ? [
                ["Students", "students", "♟"],
                ["Rooms", "rooms", "▤"],
                ["Complaints", "complaints", "♧"],
                ["Attendance", "attendance", "◷"],
                ["Announcements", "notices", "▣"],
              ]
            : [
                ["Students", "students", "♟"],
                ["Rooms", "rooms", "▤"],
                ["Wardens", "wardens", "♙"],
                ["Complaints", "complaints", "♧"],
                ["Announcements", "notices", "▣"],
              ]
          ).map(([label, id, icon]) => (
            <button className="quick-link" key={id} onClick={() => onNavigate(id)}>
              <span>{icon}</span>
              <strong>{label}</strong>
              <span className="quick-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token || !role) return null;

      return {
        token,
        role,
        name: localStorage.getItem("name") || "",
        email: localStorage.getItem("email") || "",
        assignedBlock: localStorage.getItem("assignedBlock") || "",
      };
    } catch {
      return null;
    }
  });

  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const role = String(user?.role || "").trim().toUpperCase();
  const visiblePages = navigation.filter((item) =>
    item.roles.includes(role)
  );

  const handleLogin = (data) => {
    const loggedInUser = {
      ...data,
      role: String(data.role || "").trim().toUpperCase(),
    };

    setUser(loggedInUser);
    setPage("dashboard");

    try {
      if (data.token) localStorage.setItem("token", data.token);
      localStorage.setItem("role", loggedInUser.role);
      localStorage.setItem("name", data.name || "");
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("assignedBlock", data.assignedBlock || "");
    } catch {
      // The current session still works if storage is unavailable.
    }
  };

  const handleLogout = () => {
    try {
      [
        "token",
        "role",
        "name",
        "email",
        "assignedBlock",
      ].forEach((key) => localStorage.removeItem(key));
    } catch {
      // Ignore storage errors.
    }

    setUser(null);
    setPage("dashboard");
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const currentPage = visiblePages.find((item) => item.id === page);
  const filteredPages = visiblePages.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const renderPage = () => {
    if (page === "dashboard") {
      if (role === "ADMIN") {
        return <AdminDashboard />;
      }

      return (
        <DashboardOverview
          user={user}
          role={role}
          onNavigate={setPage}
        />
      );
    }

    switch (page) {
      case "students": return <StudentManagement />;
      case "profiles": return <StudentProfile />;
      case "rooms": return <RoomManagement />;
      case "fees": return <FeeManagement />;
      case "complaints": return <Complaints />;
      case "outings": return <OutingManagement />;
      case "cleaning": return <CleaningManagement />;
      case "attendance": return <AttendanceManagement />;
      case "wardens": return <WardenManagement />;
      case "notices": return <NoticeManagement />;
      default: return <p>Choose a page from the sidebar.</p>;
    }
  };

  if (!currentPage) {
    setPage("dashboard");
  }

  return (
    <div className="hostel-app">
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark"><i /><b /></span>
          <span>HOSTEL<span className="brand-360">360</span></span>
        </div>

        <div className="sidebar-caption">WORKSPACE</div>

        <nav className="sidebar-nav">
          {visiblePages.map((item) => (
            <button
              key={`${item.id}-${item.label}`}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => {
                setPage(item.id);
                setSidebarOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="avatar">
              {(user.name || user.email || "H").charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <strong>{user.name || user.email}</strong>
              <span>{role}</span>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <span className="nav-icon">⇥</span> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <div className="breadcrumb">
            <span>Hostel360</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{currentPage?.label || "Dashboard"}</strong>
          </div>

          <div className="topbar-right">
            <label className="search-box">
              <span>⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu..."
                aria-label="Search menu"
              />
            </label>
            {search && (
              <div className="search-results">
                {filteredPages.length ? filteredPages.map((item) => (
                  <button key={`${item.id}-${item.label}`} onClick={() => {
                    setPage(item.id);
                    setSearch("");
                  }}>
                    {item.icon} {item.label}
                  </button>
                )) : <span>No matching pages</span>}
              </div>
            )}
            <button
              className="notification-button"
              aria-label="Announcements"
              onClick={() => setPage("notices")}
            >
              ♧<i />
            </button>
            <div className="topbar-avatar">
              {(user.name || user.email || "H").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="page-content">
          {renderPage()}
        </div>

        <footer className="app-footer">
          <span>© {new Date().getFullYear()} Hostel360</span>
          <span>Hostel Management System</span>
        </footer>
      </main>
    </div>
  );
}

export default App;