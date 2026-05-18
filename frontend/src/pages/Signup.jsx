import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();

  // States
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

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

  // Handle Signup
  const handleSignup = () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    navigate("/"); // go to login after signup
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
            "0 8px 25px rgba(0,0,0,0.15)"
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
          Signup
        </h2>

        {/* NAME */}
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
            Name
          </label>

          <input
            type="text"

            value={name}

            onChange={(e) =>
              setName(e.target.value)
            }

            placeholder="Enter name"

            style={{
              ...inputStyle,

              fontSize: isMobile
                ? "14px"
                : "15px"
            }}
          />
        </div>

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

          <span
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            style={{
              ...eyeStyle,

              fontSize: isMobile
                ? "16px"
                : "18px"
            }}
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </span>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSignup}
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
          Signup
        </button>

        {/* LOGIN LINK */}
        <p
          style={{
            textAlign: "center",

            marginTop: "15px",

            fontSize: isMobile
              ? "13px"
              : "14px"
          }}
        >
          Already have an account?{" "}

          <span
            onClick={() => navigate("/")}
            style={{
              color: "#2563eb",

              cursor: "pointer",

              fontWeight: "bold"
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

// Eye Icon Style
const eyeStyle = {
  position: "absolute",

  right: "12px",

  top: "38px",

  cursor: "pointer",

  color: "#64748b"
};

export default Signup;