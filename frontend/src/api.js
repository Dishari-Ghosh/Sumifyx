const BASE_URL = "https://sumifyx-backend.onrender.com";
export const signup = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
};
export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};
export const uploadPDF = async (file, docType, token) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(
    `${BASE_URL}/upload/pdf?doc_type=${docType}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    }
  );
  console.log("STATUS:", res.status);
  const data = await res.json();
  console.log("RESPONSE:", data);
  return data;
};
export const getHistory = async (token) => {
  const res = await fetch(`${BASE_URL}/history/`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
};
export const getDocument = async (id, token) => {
  const res = await fetch(`${BASE_URL}/history/${id}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
};
export const deleteDocument = async (id, token) => {
  const res = await fetch(`${BASE_URL}/history/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  return res.json();
};
