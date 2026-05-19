import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function Result() {
  const location = useLocation();

  const { summary, mcqs, images, purpose, darkMode } =
    location.state || {};

  const isStudy = purpose === "study_material";

  const showImage =
    purpose === "study_material" ||
    purpose === "research_paper" ||
    purpose === "patent";

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cleanSummary = summary
    ? summary.split("## Multiple Choice Questions")[0].trim()
    : "";

  const downloadFile = (content, filename) => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
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
      <div
        style={{
          display: "flex",
          flexDirection: isStudy && !isMobile ? "row" : "column",
          padding: isMobile ? "25px 15px" : "40px",
          gap: isMobile ? "40px" : "0"
        }}
      >

        {/* SUMMARY SECTION */}
        <div style={{
          flex: 1,
          paddingRight: isStudy && !isMobile ? "30px" : "0"
        }}>
          <h2 style={{
            textAlign: "center",
            marginBottom: "25px",
            fontSize: isMobile ? "28px" : "34px"
          }}>
            Summary
          </h2>

          {/* SUMMARY — rendered as markdown */}
          <div style={{
            lineHeight: "1.9",
            fontSize: isMobile ? "16px" : "18px",
            wordBreak: "break-word"
          }}>
            <ReactMarkdown>
              {cleanSummary || "No summary available"}
            </ReactMarkdown>
          </div>

          {/* IMAGES FROM PDF */}
          {showImage && images && images.length > 0 && (
            <div style={{ marginTop: "25px" }}>
              <h3 style={{ marginBottom: "15px" }}>Images from PDF</h3>
              {images.map((img, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <p style={{
                    fontSize: "13px",
                    color: darkMode ? "#94a3b8" : "#64748b",
                    marginBottom: "6px"
                  }}>
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

          {/* DOWNLOAD SUMMARY */}
          <div style={{ textAlign: "center", marginTop: "25px" }}>
            <button
              onClick={() => downloadFile(cleanSummary, "summary.txt")}
              style={{
                width: isMobile ? "90%" : "auto",
                maxWidth: "300px",
                padding: isMobile ? "14px 18px" : "12px 20px",
                background: darkMode
                  ? "linear-gradient(to right, #6366f1, #8b5cf6)"
                  : "linear-gradient(to right, #ff91a4, #d05d74)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: isMobile ? "15px" : "16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Download Summary
            </button>
          </div>
        </div>

        {/* DIVIDER */}
        {isStudy && !isMobile && (
          <div style={{
            width: "1px",
            background: darkMode
              ? "linear-gradient(to bottom, transparent, #94a3b8, transparent)"
              : "linear-gradient(to bottom, transparent, #475569, transparent)",
            margin: "0 20px"
          }} />
        )}

        {/* MCQ SECTION */}
        {isStudy && (
          <div style={{
            flex: 1,
            paddingLeft: !isMobile ? "30px" : "0"
          }}>
            <h2 style={{
              textAlign: "center",
              marginBottom: "25px",
              fontSize: isMobile ? "28px" : "34px"
            }}>
              MCQs
            </h2>

            {/* MCQ TEXT — each line styled */}
            <div style={{
              lineHeight: "1.9",
              fontSize: isMobile ? "16px" : "18px"
            }}>
              {mcqs ? (
                <div>
                  {mcqs.split("\n").map((line, index) => (
                    <p
                      key={index}
                      style={{
                        margin: line.startsWith("Q") ? "20px 0 5px 0" : "2px 0",
                        fontWeight: line.startsWith("Q") ? "bold" : "normal",
                        color: line.startsWith("Answer")
                          ? darkMode ? "#4ade80" : "#16a34a"
                          : darkMode ? "#ffffff" : "#000000",
                        wordBreak: "break-word"
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

            {/* DOWNLOAD MCQS */}
            <div style={{ textAlign: "center", marginTop: "25px" }}>
              <button
                onClick={() => downloadFile(mcqs, "mcqs.txt")}
                style={{
                  width: isMobile ? "90%" : "auto",
                  maxWidth: "300px",
                  padding: isMobile ? "14px 18px" : "12px 20px",
                  background: darkMode
                    ? "linear-gradient(to right, #6366f1, #8b5cf6)"
                    : "linear-gradient(to right, #ff91a4, #d05d74)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: isMobile ? "15px" : "16px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Download MCQs
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Result;