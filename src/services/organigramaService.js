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
// Obtener todos los organizacion padre
const getOrganigramasPhat = () => api.get('/obtenerOrganizacionesPadres');
// Obtener un rol por ID
const getOrganigramaByPhat = (id) => api.get(`/organizacion/${id}/hijos`);
// Obtener orgnigrama por idorg y iduser
const getShowuseraccesses = (iduser,idor) => api.get(`/showuseraccesses/${iduser}/${idor}`);
// Obtener un rol por ID
const getOrganigramaByHijo = (id) => api.get(`/obtenerHijastros/${id}/hijos`);

export default { createOrganigrama, getOrganigramas, getOrganigramaById, updateOrganigrama, deleteOrganigrama, getOrganigramasPhat,getOrganigramaByPhat,getOrganigramaByHijo,getShowuseraccesses};
