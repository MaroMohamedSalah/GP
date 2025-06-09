import { API_URL } from "../constants/apiUrl";

export const confirmEmail = async (email: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/auth/send-email-verification`, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const resData = await response.json();

  return resData;
};
