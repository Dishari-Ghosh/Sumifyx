import Header from "../components/Header";
import UploadPDF from "../components/UploadPDF";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [purpose, setPurpose] = useState("study_material");
  const [summaryType, setSummaryType] = useState("short");
  const [darkMode, setDarkMode] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!pdfFile) {
      alert("Please upload a PDF!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      let inputText = "Content extracted from uploaded PDF";
      let result = "Summary: " + inputText.slice(0, 60) + "...";

      const mcqs = "Generated MCQs will come here";

      navigate("/result", {
  state: {
    summary: result,
    mcqs,
    purpose,
    darkMode
  }
});

      setLoading(false);
    }, 1200);
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
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* MAIN */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          gap: "40px"
        }}
      >

        {/* TITLE */}
        <h2
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            textAlign: "center",
            color: darkMode ? "#ffffff" : "#0f172a"
          }}
        >
          Upload your document to summarize
        </h2>

        {/* LABEL */}
        <p
          style={{
            fontSize: "19px",
            color: darkMode ? "#cbd5f5" : "#334155"
          }}
        >
          Choose Document Type
        </p>

        {/* DROPDOWN */}
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          style={{
            width: "400px",
            padding: "17px",
            borderRadius: "10px",
            fontSize: "17px",

            background: darkMode ? "#1e293b" : "#ffffff",
            color: darkMode ? "#ffffff" : "#000000",

            border: "none",
            outline: "none",

            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
        >
          <option value="study_material">Study Material</option>
          <option value="research_paper">Research Paper</option>
          <option value="business_paper">Business Paper</option>
          <option value="patent">Patent</option>
        </select>

        {/* UPLOAD BOX */}
        <div
          style={{
            width: "650px",
            height: "220px",
            border: darkMode
              ? "2px dashed #64748b"
              : "2px dashed #94a3b8",

            borderRadius: "14px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",

            /* GLASS EFFECT */
            background: darkMode
              ? "rgba(15,23,42,0.6)"
              : "rgba(255,255,255,0.6)",

            backdropFilter: "blur(8px)"
          }}
        >
          <UploadPDF darkMode={darkMode} setPdfFile={setPdfFile} />
        </div>

        {/* BUTTON */}
        <button
  onClick={handleGenerate}
  style={{
    width: "300px",
    padding: "16px",

    /* DIFFERENT COLORS */
    background: darkMode
      ? "linear-gradient(to right, #6366f1, #8b5cf6)"   // DARK MODE (purple-blue)
      : "linear-gradient(to right, #ff91a4, #d05d74)",  // LIGHT MODE (blue-green)

    color: darkMode ? "#cbd5f5" : "#334155",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "18px",
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