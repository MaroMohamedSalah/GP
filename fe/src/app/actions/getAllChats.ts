import { API_URL } from "../constants/apiUrl";

export const getAllChats = async () => {
  const res = await fetch(`${API_URL}/conversations/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.json();
};
