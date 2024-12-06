import api from '@/api/axios';

// Crear un nuevo rol
const createSituacion = (user) => api.post('/situaciones', user);

// Obtener todos los situaciones
const getSituacions = () => api.get('/situaciones');

// Obtener un rol por ID
const getSituacionById = (id) => api.get(`/situaciones/${id}`);

// Actualizar un rol
const updateSituacion = (id, userData) => api.put(`/situaciones/${id}`, userData);

// Eliminar un rol
const deleteSituacion = (id) => api.delete(`/situaciones/${id}`);

export default { createSituacion, getSituacions, getSituacionById, updateSituacion, deleteSituacion };
