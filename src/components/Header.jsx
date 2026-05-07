import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiUser, FiClock, FiLogOut, FiSun, FiMoon } from "react-icons/fi";

function Header({ darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  /* HEADER STYLE */
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",

    /* THEME BASED */
    background: darkMode ? "#020617" : "#ffffff",
    color: darkMode ? "#ffffff" : "#000000",

    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  };

  /* MENU STYLE */
  const menuStyle = {
    position: "absolute",
    right: 0,
    top: "35px",

    background: darkMode ? "#1e293b" : "#ffffff",
    color: darkMode ? "#ffffff" : "#000000",

    borderRadius: "10px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
    width: "190px",
    padding: "10px"
  };

  return (
    <div style={headerStyle}>
      
      {/* LEFT: LOGO */}
      <img
        src="/logo.png"
        alt="logo"
        style={{
          width: "140px",
          borderRadius: "12px",
          objectFit: "cover"
        }}
      />

      {/* RIGHT: MENU */}
      <div style={{ position: "relative" }}>
        <FiMenu
          size={26}
          style={{
            cursor: "pointer",
            color: darkMode ? "#ffffff" : "#000000"
          }}
          onClick={() => setOpen(!open)}
        />

        {/* DROPDOWN */}
        {open && (
          <div style={menuStyle}>

            {/* PROFILE */}
            <p style={menuItem} onClick={() => navigate("/profile")}>
              <span style={iconText}>
                <FiUser /> My Profile
              </span>
            </p>

            {/* HISTORY */}
            <p style={menuItem} onClick={() => navigate("/history")}>
              <span style={iconText}>
                <FiClock /> History
              </span>
            </p>

            {/* APPEARANCE */}
            <div style={menuItem}>
              <span style={iconText}>
                {darkMode ? <FiMoon /> : <FiSun />}
                Appearance
              </span>

              {/* TOGGLE SWITCH */}
              <label style={switchStyle}>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  style={{ display: "none" }}
                />
                <span
                  style={{
                    ...sliderStyle,
                    backgroundColor: darkMode ? "#22c55e" : "#ccc"
                  }}
                >
                  <span
                    style={{
                      ...circleStyle,
                      transform: darkMode
                        ? "translateX(16px)"
                        : "translateX(0px)"
                    }}
                  />
                </span>
              </label>
            </div>

            {/* LOGOUT */}
            <p style={menuItem} onClick={() => navigate("/")}>
              <span style={iconText}>
                <FiLogOut /> Logout
              </span>
            </p>

          </div>
        )}
      </div>
    </div>
  );
}

/* COMMON STYLES */

const menuItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 10px",
  cursor: "pointer"
};

const iconText = {
  display: "flex",
  alignItems: "center",
  gap: "10px"
};

const switchStyle = {
  position: "relative",
  display: "inline-block",
  width: "36px",
  height: "18px"
};

const sliderStyle = {
  position: "absolute",
  cursor: "pointer",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: "20px",
  transition: "0.3s",
  display: "flex",
  alignItems: "center",
  padding: "2px"
};

const circleStyle = {
  height: "14px",
  width: "14px",
  backgroundColor: "#fff",
  borderRadius: "50%",
  transition: "0.3s"
};

export default Header;