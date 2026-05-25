import axios from "axios";

const client = axios.create({
  baseURL: "/api"
});

const getAxiosErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
    return 'Não foi possível conectar ao backend. Verifique se o servidor backend está rodando na porta 3001.';
  }

  if (error.response?.status === 500) {
    return 'Ocorreu um erro. Tente novamente mais tarde.';
  }

  return error.message || 'Erro ao processar a requisição.';
};

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getAxiosErrorMessage(error);

    if (error.response) {
      error.response.data = {
        ...error.response.data,
        message,
      };
    }

    error.message = message;
    return Promise.reject(error);
  }
);

export default client;
