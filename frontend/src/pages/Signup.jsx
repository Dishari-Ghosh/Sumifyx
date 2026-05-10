import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signup } from "../api";
function Signup() {
  const navigate = useNavigate();

  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle Signup
  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }
    try {
      const data = await signup(name, email, password);
      if (data.token) {
        alert("Account created successfully!");
        navigate("/");
      } else {
        alert(data.detail || "Signup failed");
      }
    } catch  {
    alert("Something went wrong!");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/LogSign_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          width: "360px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        }}
      >
        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: "160px" }}
          />
        </div>

        {/* TITLE */}
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#2563eb",
            borderBottom: "2px solid #2563eb",
            paddingBottom: "5px",
          }}
        >
          Signup
        </h2>

        {/* NAME */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontSize: "14px" }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            style={inputStyle}
          />
        </div>

        {/* EMAIL */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontSize: "14px" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            style={inputStyle}
          />
        </div>

        {/* PASSWORD */}
        <div style={{ marginBottom: "15px", position: "relative" }}>
          <label style={{ fontSize: "14px" }}>Password</label>

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={inputStyle}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={eyeStyle}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* BUTTON */}
        <button onClick={handleSignup} style={buttonStyle}>
          Signup
        </button>

        {/* LOGIN LINK */}
        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            style={{
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

// Input Style
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  outline: "none",
  background: "#f8fafc",
};

// Button Style
const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
};

// Eye Icon Style
const eyeStyle = {
  position: "absolute",
  right: "12px",
  top: "38px",
  cursor: "pointer",
  fontSize: "18px",
  color: "#64748b",
};

export default Signup;
