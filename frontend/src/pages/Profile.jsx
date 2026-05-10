import { useNavigate } from "react-router-dom";
function Profile() {
  const navigate = useNavigate();
  const darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("darkMode");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode ? "#0f172a" : "#f1f5f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: darkMode ? "#ffffff" : "#000000"
      }}
    >
      <div
        style={{
          background: darkMode ? "#1e293b" : "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          width: "380px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          textAlign: "center"
        }}
      >
        {/* AVATAR */}
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "linear-gradient(to right, #2563eb, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
            color: "#fff",
            margin: "0 auto 20px auto"
          }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>

        {/* NAME */}
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: darkMode ? "#ffffff" : "#1e293b"
          }}
        >
          {user.name || "User"}
        </h2>

        {/* EMAIL */}
        <p
          style={{
            fontSize: "16px",
            color: darkMode ? "#94a3b8" : "#64748b",
            marginBottom: "30px"
          }}
        >
          {user.email || "No email found"}
        </p>

        {/* DIVIDER */}
        <div
          style={{
            height: "1px",
            background: darkMode ? "#334155" : "#e2e8f0",
            marginBottom: "25px"
          }}
        />

        {/* INFO CARDS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "30px"
          }}
        >
          <div>
            <p
              style={{
                fontSize: "13px",
                color: darkMode ? "#94a3b8" : "#64748b"
              }}
            >
              Account
            </p>
            <p style={{ fontWeight: "bold", fontSize: "15px" }}>
              Free Plan
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "13px",
                color: darkMode ? "#94a3b8" : "#64748b"
              }}
            >
              Status
            </p>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "15px",
                color: "#16a34a"
              }}
            >
              Active ✅
            </p>
          </div>
        </div>

        {/* VIEW HISTORY BUTTON */}
        <button
          onClick={() => navigate("/history")}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "12px"
          }}
        >
          📄 View My History
        </button>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
