import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../api";

function Login() {
  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  /* RESPONSIVE */
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  // Handle Login
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const data = await login(email, password);

      console.log(data);

      if (data.token) {
  localStorage.setItem(
    "token",
    data.token
  );

  navigate("/home");
} else {
        alert(
          data.detail || "Login failed"
        );
      }

    } catch (error) {
      console.error(error);

      alert("Server error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        backgroundImage:
          "url('/LogSign_bg.jpg')",

        backgroundSize: "cover",

        backgroundPosition: "center",

        backgroundRepeat: "no-repeat",

        padding: "20px"
      }}
    >
      <div
        style={{
          width: "100%",

          maxWidth: "360px",

          background: "#ffffff",

          borderRadius: "16px",

          padding: isMobile
            ? "25px 20px"
            : "30px",

          boxShadow:
            "0 8px 25px rgba(0,0,0,0.1)"
        }}
      >

        {/* LOGO */}
        <div
          style={{
            textAlign: "center",

            marginBottom: "15px"
          }}
        >
          <img
            src="/logo.png"
            alt="logo"

            style={{
              width: isMobile
                ? "130px"
                : "160px"
            }}
          />
        </div>

        {/* TITLE */}
        <h2
          style={{
            textAlign: "center",

            marginBottom: "20px",

            color: "#2563eb",

            borderBottom:
              "2px solid #2563eb",

            paddingBottom: "5px",

            fontSize: isMobile
              ? "26px"
              : "30px"
          }}
        >
          Login
        </h2>

        {/* EMAIL */}
        <div
          style={{
            marginBottom: "15px"
          }}
        >
          <label
            style={{
              fontSize: isMobile
                ? "13px"
                : "14px"
            }}
          >
            Email
          </label>

          <input
            type="email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }

            placeholder="Enter email"

            style={{
              ...inputStyle,

              fontSize: isMobile
                ? "14px"
                : "15px"
            }}
          />
        </div>

        {/* PASSWORD */}
        <div
          style={{
            marginBottom: "15px",

            position: "relative"
          }}
        >
          <label
            style={{
              fontSize: isMobile
                ? "13px"
                : "14px"
            }}
          >
            Password
          </label>

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

            placeholder="Enter password"

            style={{
              ...inputStyle,

              fontSize: isMobile
                ? "14px"
                : "15px"
            }}
          />

          {/* EYE ICON */}
          <span
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            style={{
              position: "absolute",

              right: "12px",

              top: "38px",

              cursor: "pointer",

              fontSize: isMobile
                ? "16px"
                : "18px",

              color: "#64748b"
            }}
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </span>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          style={{
            ...buttonStyle,

            fontSize: isMobile
              ? "15px"
              : "16px",

            padding: isMobile
              ? "11px"
              : "12px"
          }}
        >
          Login
        </button>

        {/* SIGNUP LINK */}
        <p
          style={{
            textAlign: "center",

            marginTop: "15px",

            fontSize: isMobile
              ? "13px"
              : "14px"
          }}
        >
          Don’t have an account?{" "}

          <span
            onClick={() =>
              navigate("/signup")
            }
            style={{
              color: "#2563eb",

              cursor: "pointer",

              fontWeight: "bold"
            }}
          >
            Signup
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

  boxSizing: "border-box"
};

// Button Style
const buttonStyle = {
  width: "100%",

  background: "#2563eb",

  color: "#fff",

  border: "none",

  borderRadius: "8px",

  fontWeight: "bold",

  cursor: "pointer"
};

export default Login;
