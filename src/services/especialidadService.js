import api from '@/api/axios';

// Crear un nuevo rol
const createEspecialidades = (user) => api.post('/especialidades', user);

// Obtener todos los especialidades
const getEspecialidadess = () => api.get('/especialidades');

// Obtener un rol por ID
const getEspecialidadesById = (id) => api.get(`/especialidades/${id}`);

// Actualizar un rol
const updateEspecialidades = (id, userData) => api.put(`/especialidades/${id}`, userData);

// Eliminar un rol
const deleteEspecialidades = (id) => api.delete(`/especialidades/${id}`);

export default { createEspecialidades, getEspecialidadess, getEspecialidadesById, updateEspecialidades, deleteEspecialidades };
