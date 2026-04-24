// ✅ Save session
export const saveSession = (data) => {
  localStorage.setItem("session", JSON.stringify(data));
};

// ✅ Get session
export const getSession = () => {
  return JSON.parse(localStorage.getItem("session"));
};

// ✅ Clear session (logout)
export const clearSession = () => {
  localStorage.removeItem("session");
};