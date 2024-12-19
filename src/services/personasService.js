import api from '@/api/axios';

// Crear un nuevo rol
const createPersona = (user) => api.post('/persona', user);

// Obtener todos los Persona
const getPersonas = () => api.get('/persona');

// Obtener un rol por ID
const getPersonaById = (id) => api.get(`/persona/${id}`);

// Actualizar un rol
const updatePersona = (id, userData) => api.put(`/persona/${id}`, userData);

// Eliminar un rol
const deletePersona = (id) => api.delete(`/persona/${id}`);

export default { createPersona, getPersonas, getPersonaById, updatePersona, deletePersona };
