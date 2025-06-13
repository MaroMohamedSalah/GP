import { API_URL } from "../constants/apiUrl";

const getAllModels = async () => {
  const res = await fetch(`${API_URL}/ai-models/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.json();
};

export default getAllModels;
