import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory, getDocument, deleteDocument } from "../api";

function History() {
  const navigate = useNavigate();
  const darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const data = await getHistory(token);
        if (data.documents) {
          setDocuments(data.documents);
        } else {
          setError("Failed to load history");
        }
      } catch {
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  const handleView = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const data = await getDocument(id, token);
      navigate("/result", {
        state: {
          summary: data.notes,
          mcqs: data.mcqs,
          images: data.images,
          purpose: data.doc_type,
          darkMode
        }
      });
    } catch {
      alert("Failed to load document!");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;
    try {
      await deleteDocument(id, token);
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch {
      alert("Failed to delete document!");
    }
  };

  const getDocTypeLabel = (type) => {
    const labels = {
      study_material: "📚 Study Material",
      research_paper: "🔬 Research Paper",
      business_paper: "💼 Business Paper",
      patent: "📜 Patent"
    };
    return labels[type] || type;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: darkMode ? "#0f172a" : "#f1f5f9",
      color: darkMode ? "#ffffff" : "#000000",
      padding: "40px"
    }}>
      <h2 style={{
        textAlign: "center",
        fontSize: "34px",
        marginBottom: "30px",
        color: darkMode ? "#ffffff" : "#1e293b"
      }}>
        📄 My History
      </h2>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}
      {!loading && documents.length === 0 && (
        <p style={{ textAlign: "center", fontSize: "18px" }}>
          No documents found. Upload a PDF first!
        </p>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
        maxWidth: "1100px",
        margin: "0 auto"
      }}>
        {documents.map((doc) => (
          <div key={doc.id} style={{
            background: darkMode ? "#1e293b" : "#ffffff",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{
              fontSize: "16px",
              marginBottom: "8px",
              color: darkMode ? "#ffffff" : "#1e293b",
              wordBreak: "break-word"
            }}>
              📁 {doc.filename}
            </h3>

            <p style={{
              fontSize: "14px",
              color: "#2563eb",
              marginBottom: "6px",
              fontWeight: "bold"
            }}>
              {getDocTypeLabel(doc.doc_type)}
            </p>

            <p style={{
              fontSize: "13px",
              color: darkMode ? "#94a3b8" : "#64748b",
              marginBottom: "6px"
            }}>
              📄 {doc.total_pages} pages
            </p>

            {doc.has_mcqs && (
              <span style={{
                background: "#16a34a",
                color: "#fff",
                fontSize: "12px",
                padding: "3px 10px",
                borderRadius: "20px",
                display: "inline-block",
                marginBottom: "10px"
              }}>
                ✅ MCQs Available
              </span>
            )}

            <p style={{
              fontSize: "12px",
              color: darkMode ? "#64748b" : "#94a3b8",
              marginBottom: "15px"
            }}>
              🕐 {new Date(doc.created_at).toLocaleDateString()}
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleView(doc.id)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "14px"
                }}>
                View
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "14px"
                }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;