import { useLocation } from "react-router-dom";

function Result() {
  const location = useLocation();

  /* GET DATA */
  const { summary, mcqs, purpose, darkMode } =
    location.state || {};

  const isStudy = purpose === "study_material";

  const showImage =
    purpose === "study_material" ||
    purpose === "research_paper" ||
    purpose === "patent";

  /* DOWNLOAD FUNCTION */
  const downloadFile = (content, filename) => {
    if (!content) return;

    const blob = new Blob([content], {
      type: "text/plain"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",

        /* THEME BACKGROUND */
        backgroundImage: darkMode
          ? "url('/HomeDark_bg.jpg')"
          : "url('/HomeLight_bg.jpg')",

        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        /* TEXT COLOR */
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

        {/* SUMMARY */}
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

          {/* SUMMARY TEXT */}
          <p
            style={{
              lineHeight: "1.9",
              fontSize: "18px"
            }}
          >
            {summary || "No summary available"}
          </p>

          {/* IMAGE */}
          {showImage && (
            <img
              src="https://via.placeholder.com/600x300"
              alt="summary visual"
              style={{
                marginTop: "25px",
                width: "100%",
                borderRadius: "12px"
              }}
            />
          )}

          {/* DOWNLOAD BUTTON */}
          <div
            style={{
              textAlign: "center",
              marginTop: "25px"
            }}
          >
            <button
              onClick={() =>
                downloadFile(summary, "summary.txt")
              }
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
              Download Summary
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
          <div
            style={{
              flex: 1,
              paddingLeft: "30px"
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
              MCQs
            </h2>

            {/* MCQ TEXT */}
            {mcqs ? (
              <p
                style={{
                  lineHeight: "1.9",
                  fontSize: "18px"
                }}
              >
                {mcqs}
              </p>
            ) : (
              <p>No MCQs available</p>
            )}

            {/* DOWNLOAD BUTTON */}
            <div
              style={{
                textAlign: "center",
                marginTop: "25px"
              }}
            >
              <button
                onClick={() =>
                  downloadFile(mcqs, "mcqs.txt")
                }
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