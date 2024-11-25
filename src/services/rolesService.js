import api from '@/api/axios';

// Crear un nuevo rol
const createRols = (user) => api.post('/roles', user);

// Obtener todos los roles
const getRolss = () => api.get('/roles');

// Obtener un rol por ID
const getRolsById = (id) => api.get(`/roles/${id}`);

// Actualizar un rol
const updateRols = (id, userData) => api.put(`/roles/${id}`, userData);

// Eliminar un rol
const deleteRols = (id) => api.delete(`/roles/${id}`);

export default { createRols, getRolss, getRolsById, updateRols, deleteRols };
