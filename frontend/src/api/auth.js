import client from "./client";

export const loginRequest = async (email, password) => {
  const response = await client.post("/api/auth/login", {
    email,
    password
  });

  return response.data;
};

export const registerRequest = async (data) => {
  const response = await client.post("/api/auth/register", data);
  return response.data;
};
