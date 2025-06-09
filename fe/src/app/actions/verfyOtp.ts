import { API_URL } from "../constants/apiUrl";

const verifyOtp = async (code: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: "POST",
    body: JSON.stringify({ code }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export default verifyOtp;
