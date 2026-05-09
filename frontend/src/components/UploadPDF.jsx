import { useState } from "react";

function UploadPDF({ darkMode, setPdfFile }) {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);
      setPdfFile(file);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>

      {/* TITLE */}
      <p
        style={{
          marginBottom: "8px",
          fontSize: "15px",
          color: darkMode ? "#ffffff" : "#000000"
        }}
      >
        Upload PDF:
      </p>

      {/* FILE SELECT SECTION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px"
        }}
      >
        {/* BUTTON */}
        <label
          style={{
            padding: "8px 14px",

            /* BUTTON COLOR BASED ON MODE */
            background: darkMode ? "#334155" : "#e2e8f0",

            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            color: darkMode ? "#ffffff" : "#000000"
          }}
        >
          Choose File
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        {/* STATUS TEXT */}
        <span
          style={{
            fontSize: "14px",

            /* FIXED COLOR ISSUE */
            color: darkMode ? "#cbd5f5" : "#475569"
          }}
        >
          {fileName ? `Uploaded: ${fileName}` : "No file chosen"}
        </span>
      </div>

      {/* HINT TEXT */}
      <p
        style={{
          marginTop: "30px",
          fontSize: "16px",

          /* FIXED HERE ALSO */
          color: darkMode ? "#cbd5f5" : "#475569"
        }}
      >
        Select or drop a file (PDF)
      </p>

    </div>
  );
}

export default UploadPDF;