import Header from "../components/Header";
import UploadPDF from "../components/UploadPDF";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadPDF } from "../api";

function Home() {
  const navigate = useNavigate();

  const [purpose, setPurpose] = useState("study_material");
  const [darkMode, setDarkMode] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* RESPONSIVE STATE */
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* GENERATE SUMMARY */
  const handleGenerate = async () => {
    if (!pdfFile) {
      alert("Please upload a PDF!");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await uploadPDF(
        pdfFile,
        purpose,
        token
      );

      console.log("RESPONSE:", response);

      navigate("/result", {
        state: {
          summary: response.notes || "No summary generated",
          mcqs: response.mcqs || "",
          images: response.images || [],
          purpose,
          darkMode,
          total_pages: response.total_pages,
          mcq_count: response.mcq_count
        }
      });
    } catch (error) {
      console.error(error);

      alert("Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",

        /* BACKGROUND SWITCH */
        backgroundImage: darkMode
          ? "url('/HomeDark_bg.jpg')"
          : "url('/HomeLight_bg.jpg')",

        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        /* TEXT COLOR */
        color: darkMode ? "#ffffff" : "#0f172a",

        transition: "all 0.3s ease"
      }}
    >
      {/* HEADER */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* MAIN */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          minHeight: "80vh",

          gap: isMobile ? "28px" : "40px",

          padding: isMobile
            ? "25px 15px"
            : "40px 20px"
        }}
      >
        {/* TITLE */}
        <h2
          style={{
            fontSize: isMobile ? "28px" : "36px",
            fontWeight: "bold",
            textAlign: "center",
            color: darkMode ? "#ffffff" : "#0f172a",
            lineHeight: "1.3"
          }}
        >
          Upload your document to summarize
        </h2>

        {/* LABEL */}
        <p
          style={{
            fontSize: isMobile ? "16px" : "19px",
            color: darkMode ? "#cbd5f5" : "#334155",
            textAlign: "center"
          }}
        >
          Choose Document Type
        </p>

        {/* DROPDOWN */}
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          style={{
            width: "90%",
            maxWidth: "400px",

            padding: isMobile ? "14px" : "17px",

            borderRadius: "10px",

            fontSize: isMobile ? "15px" : "17px",

            background: darkMode
              ? "#1e293b"
              : "#ffffff",

            color: darkMode
              ? "#ffffff"
              : "#000000",

            border: "none",
            outline: "none",

            boxShadow:
              "0 4px 15px rgba(0,0,0,0.2)"
          }}
        >
          <option value="study_material">
            Study Material
          </option>

          <option value="research_paper">
            Research Paper
          </option>

          <option value="business_paper">
            Business Paper
          </option>

          <option value="patent">
            Patent
          </option>
        </select>

        {/* UPLOAD BOX */}
        <div
          style={{
            width: "90%",
            maxWidth: "650px",

            minHeight: isMobile
              ? "200px"
              : "220px",

            border: darkMode
              ? "2px dashed #64748b"
              : "2px dashed #94a3b8",

            borderRadius: "14px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",

            padding: isMobile
              ? "20px 15px"
              : "20px",

            /* GLASS EFFECT */
            background: darkMode
              ? "rgba(15,23,42,0.6)"
              : "rgba(255,255,255,0.6)",

            backdropFilter: "blur(8px)"
          }}
        >
          <UploadPDF
            darkMode={darkMode}
            setPdfFile={setPdfFile}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleGenerate}
          style={{
            width: "90%",
            maxWidth: "300px",

            padding: isMobile
              ? "14px"
              : "16px",

            background: darkMode
              ? "linear-gradient(to right, #6366f1, #8b5cf6)"
              : "linear-gradient(to right, #ff91a4, #d05d74)",

            color: darkMode
              ? "#cbd5f5"
              : "#334155",

            border: "none",
            borderRadius: "12px",

            fontWeight: "bold",

            fontSize: isMobile
              ? "16px"
              : "18px",

            cursor: "pointer",
            opacity: loading ? 0.6 : 1
          }}
          disabled={loading}
        >
          {loading ? "Processing..." : "SUMMARIZE"}
        </button>
      </div>
    </div>
  );
}

export default Home;