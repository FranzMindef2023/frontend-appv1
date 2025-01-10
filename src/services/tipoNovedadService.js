import api from '@/api/axios';

// Crear un nuevo rol
const createTipoNov = (user) => api.post('/tiponovedades', user);

// Obtener todos los tiponovedades
const getTipoNov = () => api.get('/tiponovedades');

// Obtener un rol por ID
const getTipoNovById = (id) => api.get(`/tiponovedades/${id}`);

// Actualizar un rol
const updateTipoNov = (id, userData) => api.put(`/tiponovedades/${id}`, userData);

// Eliminar un rol
const deleteTipoNov= (id) => api.delete(`/tiponovedades/${id}`);

export default { createTipoNov, getTipoNov, getTipoNovById, updateTipoNov, deleteTipoNov };
