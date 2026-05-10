import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";

function Result() {
  const location = useLocation();

  /* GET DATA */
  const { summary, mcqs, images, purpose, darkMode } =
    location.state || {};

  const isStudy = purpose === "study_material";

  const showImage =
    purpose === "study_material" ||
    purpose === "research_paper" ||
    purpose === "patent";

  /* CLEAN SUMMARY — remove MCQ section from summary */
  const cleanSummary = summary
    ? summary.split("## Multiple Choice Questions")[0].trim()
    : "";

  /* DOWNLOAD AS PDF */
  const downloadPDF = (content, filename) => {
    if (!content) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 7;
    let y = 20;

    // Split content into lines
    const lines = content.split("\n");

    lines.forEach((line) => {
      // Skip empty lines but add space
      if (!line.trim()) {
        y += 4;
        return;
      }

      // Clean markdown symbols
      const cleanLine = line
        .replace(/#{1,6} /g, "")   // remove # headings
        .replace(/\*\*/g, "")      // remove bold **
        .replace(/\*/g, "")        // remove italic *
        .trim();

      if (!cleanLine) return;

      // Wrap long lines
      const wrappedLines = doc.splitTextToSize(cleanLine, maxWidth);

      wrappedLines.forEach((wrappedLine) => {
        // Add new page if needed
        if (y > 280) {
          doc.addPage();
          y = 20;
        }

        // Style headings
        if (line.startsWith("#")) {
          doc.setFontSize(13);
          doc.setFont("helvetica", "bold");
        } else if (line.startsWith("Q")) {
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
        } else if (line.startsWith("Answer")) {
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 150, 0); // green
        } else {
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0); // black
        }

        doc.text(wrappedLine, margin, y);
        y += lineHeight;
      });

      // Reset color after answer
      doc.setTextColor(0, 0, 0);
    });

    doc.save(filename);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: darkMode
          ? "url('/HomeDark_bg.jpg')"
          : "url('/HomeLight_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: darkMode ? "#ffffff" : "#000000"
      }}
    >

      {/* MAIN CONTENT */}
      <div
        style={{
          display: "flex",
          flexDirection: isStudy ? "row" : "column",
          padding: "40px"
        }}
      >

        {/* SUMMARY SECTION */}
        <div
          style={{
            flex: 1,
            paddingRight: isStudy ? "30px" : "0"
          }}
        >
          {/* HEADING */}
          <h2
            style={{
              textAlign: "center",
              marginBottom: "25px",
              fontSize: "34px"
            }}
          >
            Summary
          </h2>

          {/* SUMMARY TEXT — cleaned, no MCQ section */}
          <div style={{ lineHeight: "1.9", fontSize: "18px" }}>
            <ReactMarkdown>
              {cleanSummary || "No summary available"}
            </ReactMarkdown>
          </div>

          {/* IMAGES FROM PDF */}
          {showImage && images && images.length > 0 && (
            <div style={{ marginTop: "25px" }}>
              <h3 style={{ marginBottom: "15px" }}>
                Images from PDF
              </h3>
              {images.map((img, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <p
                    style={{
                      fontSize: "13px",
                      color: darkMode ? "#94a3b8" : "#64748b",
                      marginBottom: "6px"
                    }}
                  >
                    Page {img.page_number}
                  </p>
                  <img
                    src={img.data_uri}
                    alt={`Page ${img.page_number}`}
                    style={{
                      width: "100%",
                      borderRadius: "12px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* DOWNLOAD SUMMARY AS PDF */}
          <div style={{ textAlign: "center", marginTop: "25px" }}>
            <button
              onClick={() => downloadPDF(cleanSummary, "summary.pdf")}
              style={{
                padding: "12px 20px",
                background: darkMode
                  ? "linear-gradient(to right, #6366f1, #8b5cf6)"
                  : "linear-gradient(to right, #ff91a4, #d05d74)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Download Summary (PDF)
            </button>
          </div>
        </div>

        {/* DIVIDER */}
        {isStudy && (
          <div
            style={{
              width: "1px",
              background: darkMode
                ? "linear-gradient(to bottom, transparent, #94a3b8, transparent)"
                : "linear-gradient(to bottom, transparent, #475569, transparent)",
              margin: "0 20px"
            }}
          />
        )}

        {/* MCQ SECTION */}
        {isStudy && (
          <div style={{ flex: 1, paddingLeft: "30px" }}>

            {/* HEADING */}
            <h2
              style={{
                textAlign: "center",
                marginBottom: "25px",
                fontSize: "34px"
              }}
            >
              MCQs
            </h2>

            {/* MCQ TEXT */}
            <div style={{ lineHeight: "1.9", fontSize: "18px" }}>
              {mcqs ? (
                <div>
                  {mcqs.split("\n").map((line, index) => (
                    <p
                      key={index}
                      style={{
                        margin: line.startsWith("Q")
                          ? "20px 0 5px 0"
                          : "2px 0",
                        fontWeight: line.startsWith("Q")
                          ? "bold"
                          : "normal",
                        color: line.startsWith("Answer")
                          ? darkMode ? "#ffffff" : "#000000"
                          : darkMode ? "#ffffff" : "#000000"
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p>No MCQs available</p>
              )}
            </div>

            {/* DOWNLOAD MCQS AS PDF */}
            <div style={{ textAlign: "center", marginTop: "25px" }}>
              <button
                onClick={() => downloadPDF(mcqs, "mcqs.pdf")}
                style={{
                  padding: "12px 20px",
                  background: darkMode
                    ? "linear-gradient(to right, #6366f1, #8b5cf6)"
                    : "linear-gradient(to right, #ff91a4, #d05d74)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Download MCQs (PDF)
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Result;
