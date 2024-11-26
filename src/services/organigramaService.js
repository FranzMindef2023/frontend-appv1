import api from '@/api/axios';

// Crear un nuevo rol
const createOrganigrama = (user) => api.post('/organizacion', user);

// Obtener todos los organizacion
const getOrganigramas = () => api.get('/organizacion');

// Obtener un rol por ID
const getOrganigramaById = (id) => api.get(`/organizacion/${id}`);

// Actualizar un rol
const updateOrganigrama = (id, userData) => api.put(`/organizacion/${id}`, userData);

// Eliminar un rol
const deleteOrganigrama = (id) => api.delete(`/organizacion/${id}`);

export default { createOrganigrama, getOrganigramas, getOrganigramaById, updateOrganigrama, deleteOrganigrama };
