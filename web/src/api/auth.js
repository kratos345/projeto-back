import client from "./client";

export const loginRequest = async (email, password) => {
  const response = await client.post("/auth/login", {
    email,
    password
  });

  return response.data;
};

export const registerRequest = async (data) => {
  const response = await client.post("/auth/register", data);
  return response.data;
};

export const requestAccount = async (data) => {
  const response = await client.post('/auth/request-account', data);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await client.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (email, password) => {
  const response = await client.post('/auth/reset-password', { email, password });
  return response.data;
};

