import api from '@/api/axios';

// Crear un nuevo rol
const createFuerzas = (user) => api.post('/fuerzas', user);

// Obtener todos los fuerzas
const getFuerzass = () => api.get('/fuerzas');

// Obtener un rol por ID
const getFuerzasById = (id) => api.get(`/fuerzas/${id}`);

// Actualizar un rol
const updateFuerzas = (id, userData) => api.put(`/fuerzas/${id}`, userData);

// Eliminar un rol
const deleteFuerzas = (id) => api.delete(`/fuerzas/${id}`);

export default { createFuerzas, getFuerzass, getFuerzasById, updateFuerzas, deleteFuerzas };
