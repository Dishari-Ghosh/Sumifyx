import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiUser,
  FiClock,
  FiLogOut,
  FiSun,
  FiMoon
} from "react-icons/fi";

function Header({ darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  /* HEADER STYLE */
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    padding: "18px 28px",

    background: darkMode
      ? "rgba(2,6,23,0.8)"
      : "rgba(255,255,255,0.75)",

    backdropFilter: "blur(10px)",

    color: darkMode ? "#ffffff" : "#0f172a",

    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",

    position: "sticky",
    top: 0,
    zIndex: 1000
  };

  /* MENU STYLE */
  const menuStyle = {
    position: "absolute",

    top: "42px",
    right: 0,

    width: "220px",

    background: darkMode
      ? "rgba(15,23,42,0.95)"
      : "rgba(255,255,255,0.95)",

    color: darkMode ? "#ffffff" : "#0f172a",

    borderRadius: "16px",

    padding: "12px",

    backdropFilter: "blur(12px)",

    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",

    border: darkMode
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(0,0,0,0.05)"
  };

  return (
    <div style={headerStyle}>
      {/* LOGO */}
      <img
        src="/logo.png"
        alt="logo"
        style={{
          width: "145px",
          borderRadius: "12px",
          objectFit: "cover"
        }}
      />

      {/* RIGHT MENU */}
      <div style={{ position: "relative" }}>
        <FiMenu
          size={28}
          onClick={() => setOpen(!open)}
          style={{
            cursor: "pointer",
            color: darkMode ? "#ffffff" : "#0f172a"
          }}
        />

        {/* DROPDOWN */}
        {open && (
          <div style={menuStyle}>
            {/* PROFILE */}
            <div
              style={menuItem}
              onClick={() => navigate("/profile")}
            >
              <span style={iconText}>
                <FiUser />
                My Profile
              </span>
            </div>

            {/* HISTORY */}
            <div
              style={menuItem}
              onClick={() => navigate("/history")}
            >
              <span style={iconText}>
                <FiClock />
                History
              </span>
            </div>

            {/* APPEARANCE */}
            <div style={menuItem}>
              <span style={iconText}>
                {darkMode ? <FiMoon /> : <FiSun />}
                Appearance
              </span>

              {/* SWITCH */}
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
                    backgroundColor: darkMode
                      ? "#6366f1"
                      : "#cbd5e1"
                  }}
                >
                  <span
                    style={{
                      ...circleStyle,
                      transform: darkMode
                        ? "translateX(18px)"
                        : "translateX(0px)"
                    }}
                  />
                </span>
              </label>
            </div>

            {/* DIVIDER */}
            <div
              style={{
                height: "1px",
                background: darkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
                margin: "8px 0"
              }}
            />

            {/* LOGOUT */}
            <div
              style={menuItem}
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/");
              }}
            >
              <span style={iconText}>
                <FiLogOut />
                Logout
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* COMMON MENU ITEM STYLE */
const menuItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  padding: "12px 14px",

  borderRadius: "10px",

  cursor: "pointer",

  transition: "0.2s ease",

  fontSize: "15px",

  marginBottom: "4px"
};

/* ICON + TEXT */
const iconText = {
  display: "flex",
  alignItems: "center",
  gap: "10px"
};

/* SWITCH STYLE */
const switchStyle = {
  position: "relative",

  display: "inline-block",

  width: "42px",
  height: "22px"
};

const sliderStyle = {
  position: "absolute",

  cursor: "pointer",

  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  borderRadius: "30px",

  transition: "0.3s",

  display: "flex",
  alignItems: "center",

  padding: "2px"
};

const circleStyle = {
  width: "18px",
  height: "18px",

  backgroundColor: "#ffffff",

  borderRadius: "50%",

  transition: "0.3s"
};

export default Header;
