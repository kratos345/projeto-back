import axios from "axios";

// Em desenvolvimento: usar /api (proxy do Vite)
// Em produção: usar localhost:3001 ou URL configurada
const getApiUrl = () => {
  if (import.meta.env.DEV) {
    return '/api';
  }
  return import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
};

const client = axios.create({
  baseURL: getApiUrl()
});

const getAxiosErrorMessage = (error) => {
  // Mensagem customizada do backend
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Erro de conexão
  if (!error.response) {
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      const apiUrl = getApiUrl();
      return `⚠️ Erro de conexão com o backend em ${apiUrl}. Verifique se:\n1. Backend está rodando\n2. URL correta no .env (VITE_API_URL)\n3. Firewall não bloqueia a porta`;
    }
    return `⚠️ Erro de rede: ${error.message}`;
  }

  // Erro 500 do servidor
  if (error.response?.status === 500) {
    return '❌ Erro no servidor (500). O backend pode estar fora do ar.';
  }

  // Erro 401 não autorizado
  if (error.response?.status === 401) {
    return 'Sessão expirada. Faça login novamente.';
  }

  // Erro 403 proibido
  if (error.response?.status === 403) {
    return 'Acesso negado. Você não tem permissão.';
  }

  // Erro 404 não encontrado
  if (error.response?.status === 404) {
    return 'Recurso não encontrado.';
  }

  // Erro CORS
  if (error.message.includes('CORS')) {
    return '⚠️ Erro CORS: Origem não permitida. Verifique CLIENT_URL no backend .env';
  }

  return error.message || '❌ Erro ao processar a requisição.';
};

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Log em desenvolvimento
  if (import.meta.env.DEV) {
    console.log(`🔗 [API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }

  return config;
});

client.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ [API] ${response.status} - ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const message = getAxiosErrorMessage(error);

    // Log detalhado em desenvolvimento
    if (import.meta.env.DEV) {
      console.error(`❌ [API Error]`, {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        apiUrl: getApiUrl()
      });
    }

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
