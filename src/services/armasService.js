import api from '@/api/axios';

// Crear un nuevo rol
const createArmas = (user) => api.post('/armas', user);

// Obtener todos los armas
const getArmass = () => api.get('/armas');

// Obtener un rol por ID
const getArmasById = (id) => api.get(`/armas/${id}`);

// Actualizar un rol
const updateArmas = (id, userData) => api.put(`/armas/${id}`, userData);

// Eliminar un rol
const deleteArmas = (id) => api.delete(`/armas/${id}`);

export default { createArmas, getArmass, getArmasById, updateArmas, deleteArmas };
