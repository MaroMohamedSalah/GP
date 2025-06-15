import { API_URL } from "../constants/apiUrl";

export const startNewChat = async (agent: string, name: string) => {
  const res = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    body: JSON.stringify({ agent, name }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.json();
};
