import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir el token en todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Función para refrescar el token
const refreshAuthToken = async () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/refresh', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const newToken = response.data.access_token;
    sessionStorage.setItem('token', newToken);
    return newToken;
  } catch (error) {
    console.error('Error al refrescar el token:', error.response?.data || error.message);
    sessionStorage.clear();
    window.location.href = '/auth/sign-in';
    throw error;
  }
};

// Interceptor para manejar la expiración del token y refrescarlo automáticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAuthToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('No se pudo refrescar el token:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
