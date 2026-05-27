import axios from "axios";

// Detectar URL da API automaticamente
const getApiUrl = () => {
  // Em desenvolvimento: usar /api (proxy do Vite)
  if (import.meta.env.DEV) {
    return '/api';
  }
  // Em produção: usar VITE_API_URL ou mesma origem
  return import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
};

// Verificar se backend está acessível
const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${getApiUrl()}/health`, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.warn('⚠️ Backend não respondeu ao health check');
    return false;
  }
};

// Criar cliente axios com retry automático
const client = axios.create({
  baseURL: getApiUrl(),
  timeout: 30000
});

// Contador de tentativas de reconexão
let retryCount = 0;
const MAX_RETRIES = 3;

const getAxiosErrorMessage = (error) => {
  // Mensagem customizada do backend
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Erro de timeout
  if (error.code === 'ECONNABORTED') {
    return '⏱️ Timeout: Backend não respondeu no tempo esperado. Verifique a conexão.';
  }

  // Erro de conexão
  if (!error.response) {
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      return `❌ Backend não está acessível em ${getApiUrl()}.\n\nSolução:\n1. Verifique se backend está rodando (npm run dev)\n2. Confira o .env do frontend\n3. Libere porta 3001 no firewall`;
    }
    return `⚠️ Erro de rede: ${error.message}`;
  }

  // Erro 500 do servidor
  if (error.response?.status === 500) {
    return '❌ Erro interno no servidor. Verifique os logs do backend.';
  }

  // Erro 401 não autorizado
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    return 'Sessão expirada. Faça login novamente.';
  }

  // Erro 403 proibido
  if (error.response?.status === 403) {
    return 'Acesso negado. Verifique suas permissões.';
  }

  // Erro 404 não encontrado
  if (error.response?.status === 404) {
    return 'Recurso não encontrado no servidor.';
  }

  // Erro CORS
  if (error.message.includes('CORS') || error.response?.status === 0) {
    return `⚠️ CORS bloqueado!\n\nO backend em ${getApiUrl()} não autoriza requisições daqui.\n\nVerifique no backend/.env:\nCLIENT_URL deve incluir ${window.location.origin}`;
  }

  return error.message || '❌ Erro desconhecido na requisição.';
};

// Interceptor de requisição
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log(`🔗 [${config.method.toUpperCase()}] ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error.message);
    return Promise.reject(error);
  }
);

// Interceptor de resposta com retry automático
client.interceptors.response.use(
  (response) => {
    retryCount = 0; // Reset retry count on success
    if (import.meta.env.DEV) {
      console.log(`✅ [${response.status}] ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const config = error.config;

    // Não fazer retry em certos erros
    if (!config || error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 404) {
      const message = getAxiosErrorMessage(error);
      console.error(`❌ [Erro ${error.response?.status || 'Rede'}]`, message);
      
      if (error.response) {
        error.response.data = { ...error.response.data, message };
      }
      error.message = message;
      return Promise.reject(error);
    }

    // Retry automático para erros de rede ou 5xx
    if (retryCount < MAX_RETRIES && (!error.response || error.response?.status >= 500)) {
      retryCount++;
      console.warn(`⚠️ Tentativa ${retryCount}/${MAX_RETRIES} em 2 segundos...`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      return client(config);
    }

    const message = getAxiosErrorMessage(error);
    console.error(`❌ [Erro Final]`, {
      url: config?.url,
      status: error.response?.status,
      retries: retryCount,
      message
    });

    if (error.response) {
      error.response.data = { ...error.response.data, message };
    }
    error.message = message;
    return Promise.reject(error);
  }
);

// Exportar client e health check
export { checkBackendHealth };
export default client;
