import api from '@/api/axios';

// Crear un nuevo rol
const createExpedicion = (user) => api.post('/expediciones', user);

// Obtener todos los expediciones
const getExpedicions = () => api.get('/expediciones');

// Obtener un rol por ID
const getExpedicionById = (id) => api.get(`/expediciones/${id}`);

// Actualizar un rol
const updateExpedicion = (id, userData) => api.put(`/expediciones/${id}`, userData);

// Eliminar un rol
const deleteExpedicion = (id) => api.delete(`/expediciones/${id}`);

export default { createExpedicion, getExpedicions, getExpedicionById, updateExpedicion, deleteExpedicion };
