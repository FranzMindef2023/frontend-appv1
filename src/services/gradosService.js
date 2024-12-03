import api from '@/api/axios';

// Crear un nuevo rol
const createGrados = (user) => api.post('/grados', user);

// Obtener todos los grados
const getGradoss = () => api.get('/grados');

// Obtener un rol por ID
const getGradosById = (id) => api.get(`/grados/${id}`);

// Actualizar un rol
const updateGrados = (id, userData) => api.put(`/grados/${id}`, userData);

// Eliminar un rol
const deleteGrados = (id) => api.delete(`/grados/${id}`);

export default { createGrados, getGradoss, getGradosById, updateGrados, deleteGrados };
