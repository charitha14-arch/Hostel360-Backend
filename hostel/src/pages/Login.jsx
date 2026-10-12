import React, { useState } from "react";

function Login({ onLogin }) {
  const [role, setRole] = useState("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Select the backend endpoint based on the role
      const endpoint =
  role === "ADMIN"
    ? "http://localhost:8080/api/administrator-auth/login"
    : role === "WARDEN"
    ? "http://localhost:8080/api/warden-auth/login"
    : "http://localhost:8080/api/auth/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      // Handle responses that are not valid JSON
      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Invalid response from backend. Check your Spring Boot controller."
        );
      }

      // Handle incorrect credentials or server errors
      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Invalid email or password."
        );
      }

      // Check the role returned by the backend
      const actualRole = String(data.role || "")
        .trim()
        .toUpperCase();

      if (!actualRole) {
        throw new Error(
          "Role missing from backend response."
        );
      }

      if (actualRole !== role) {
        throw new Error(
          `This account belongs to ${actualRole}. Please select the correct login option.`
        );
      }

      // Student and Warden login must return a token
      if (role !== "ADMIN" && !data.token) {
        throw new Error(
          "Login token missing. Check your AuthController."
        );
      }

      // Pass user details to App.jsx
      onLogin({
        ...data,
        role: actualRole,
        email: data.email || email.trim(),
      });
    } catch (err) {
      if (
        err instanceof TypeError &&
        err.message !== ""
      ) {
        setError(
          "Cannot connect to backend. Make sure Spring Boot is running on port 8080."
        );
      } else {
        setError(
          err.message || "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form
        onSubmit={handleLogin}
        style={styles.card}
      >
        <div style={styles.logo}>H360</div>

        <h1 style={styles.heading}>Hostel360</h1>

        <p style={styles.subtitle}>
          Hostel Management System
        </p>

        <label
          htmlFor="role"
          style={styles.label}
        >
          Login As
        </label>

        <select
          id="role"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setError("");
          }}
          style={styles.input}
          required
        >
          <option value="STUDENT">
            Student Login
          </option>

          <option value="WARDEN">
            Warden Login
          </option>

          <option value="ADMIN">
            Administrator Login
          </option>
        </select>

        <label
          htmlFor="email"
          style={styles.label}
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          autoComplete="username"
          style={styles.input}
          required
        />

        <label
          htmlFor="password"
          style={styles.label}
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          autoComplete="current-password"
          style={styles.input}
          required
        />

        {error && (
          <p
            role="alert"
            style={styles.error}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Logging in..."
            : `Login as ${
                role === "ADMIN"
                  ? "Administrator"
                  : role === "WARDEN"
                  ? "Warden"
                  : "Student"
              }`}
        </button>

        <p style={styles.footer}>
          Secure access to your Hostel360 portal
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background:
      "linear-gradient(135deg, #e0e7ff, #f5f3ff, #dbeafe)",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "32px",
    borderRadius: "18px",
    backgroundColor: "#ffffff",
    boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
    boxSizing: "border-box",
  },

  logo: {
    width: "65px",
    height: "65px",
    margin: "0 auto 12px",
    borderRadius: "16px",
    backgroundColor: "#4338ca",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "22px",
    fontWeight: "bold",
  },

  heading: {
    textAlign: "center",
    color: "#312e81",
    margin: "8px 0",
    fontSize: "30px",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: "28px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "16px",
    color: "#334155",
    fontWeight: "bold",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "15px",
    boxSizing: "border-box",
    outlineColor: "#4f46e5",
    backgroundColor: "#ffffff",
    color: "#1e293b",
  },

  button: {
    width: "100%",
    padding: "13px",
    marginTop: "24px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4338ca",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
  },

  error: {
    marginTop: "14px",
    padding: "10px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "6px",
    fontSize: "14px",
    overflowWrap: "anywhere",
  },

  footer: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "12px",
    marginTop: "20px",
  },
};

export default Login;