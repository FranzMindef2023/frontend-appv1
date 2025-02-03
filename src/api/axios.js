import axios from 'axios';
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: 'http://laravel.local/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir el token en todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // Obtiene el token de la cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para cerrar sesión si el token expira
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expirado, cerrando sesión...');
      
      // Eliminar token y limpiar la sesión
      Cookies.remove("token");

      // Redirigir al usuario a la página de inicio de sesión
      window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  }
);

export default api;
