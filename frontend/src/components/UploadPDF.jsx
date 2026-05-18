import { useState, useEffect } from "react";

function UploadPDF({ darkMode, setPdfFile }) {
  const [fileName, setFileName] = useState("");

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);
      setPdfFile(file);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        width: "100%"
      }}
    >

      {/* TITLE */}
      <p
        style={{
          marginBottom: "8px",

          fontSize: isMobile
            ? "14px"
            : "15px",

          color: darkMode
            ? "#ffffff"
            : "#000000"
        }}
      >
        Upload PDF:
      </p>

      {/* FILE SELECT SECTION */}
      <div
        style={{
          display: "flex",

          flexDirection: isMobile
            ? "column"
            : "row",

          alignItems: "center",

          justifyContent: "center",

          gap: isMobile
            ? "12px"
            : "10px",

          width: "100%"
        }}
      >

        {/* BUTTON */}
        <label
          style={{
            padding: isMobile
              ? "10px 16px"
              : "8px 14px",

            /* BUTTON COLOR BASED ON MODE */
            background: darkMode
              ? "#334155"
              : "#e2e8f0",

            borderRadius: "6px",

            cursor: "pointer",

            fontSize: isMobile
              ? "13px"
              : "14px",

            color: darkMode
              ? "#ffffff"
              : "#000000",

            width: isMobile
              ? "80%"
              : "auto",

            maxWidth: "220px",

            textAlign: "center"
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
            fontSize: isMobile
              ? "13px"
              : "14px",

            color: darkMode
              ? "#cbd5f5"
              : "#475569",

            wordBreak: "break-word",

            textAlign: "center",

            maxWidth: "90%"
          }}
        >
          {fileName
            ? `Uploaded: ${fileName}`
            : "No file chosen"}
        </span>
      </div>

      {/* HINT TEXT */}
      <p
        style={{
          marginTop: isMobile
            ? "22px"
            : "30px",

          fontSize: isMobile
            ? "14px"
            : "16px",

          color: darkMode
            ? "#cbd5f5"
            : "#475569",

          textAlign: "center",

          padding: "0 10px"
        }}
      >
        Select or drop a file (PDF)
      </p>

    </div>
  );
}

export default UploadPDF;