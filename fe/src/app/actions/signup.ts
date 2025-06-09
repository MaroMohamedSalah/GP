import { API_URL } from "../constants/apiUrl";

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const signup = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData = await response.json();

  return resData;
};
