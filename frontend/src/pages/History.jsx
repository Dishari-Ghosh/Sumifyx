function History() {
  const darkMode =
    JSON.parse(localStorage.getItem("darkMode")) || false;

  return (
    <div
      style={{
        minHeight: "100vh",

        /* SIMPLE BG */
        background: darkMode ? "#000000" : "#ffffff",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        color: darkMode ? "#ffffff" : "#000000",

        fontSize: "32px",
        fontWeight: "bold"
      }}
    >
      History page will appear here
    </div>
  );
}

export default History;