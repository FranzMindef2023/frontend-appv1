import api from '@/api/axios';

// Crear un nuevo rol
const createSexos = (user) => api.post('/sexos', user);

// Obtener todos los sexos
const getSexoss = () => api.get('/sexos');

// Obtener un rol por ID
const getSexosById = (id) => api.get(`/sexos/${id}`);

// Actualizar un rol
const updateSexos = (id, userData) => api.put(`/sexos/${id}`, userData);

// Eliminar un rol
const deleteSexos = (id) => api.delete(`/sexos/${id}`);

export default { createSexos, getSexoss, getSexosById, updateSexos, deleteSexos };
