import { API_URL } from "../constants/apiUrl";

export const sendMessage = async (id: string, message: string) => {
  const res = await fetch(`${API_URL}/conversations/${id}/ask`, {
    method: "POST",
    body: JSON.stringify({ message }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  // return res.json();
  return res
};
