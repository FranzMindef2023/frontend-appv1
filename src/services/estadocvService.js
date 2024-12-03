import api from '@/api/axios';

// Crear un nuevo rol
const createEstadocv = (user) => api.post('/estadocv', user);

// Obtener todos los estadocv
const getEstadocvs = () => api.get('/estadocv');

// Obtener un rol por ID
const getEstadocvById = (id) => api.get(`/estadocv/${id}`);

// Actualizar un rol
const updateEstadocv = (id, userData) => api.put(`/estadocv/${id}`, userData);

// Eliminar un rol
const deleteEstadocv = (id) => api.delete(`/estadocv/${id}`);

export default { createEstadocv, getEstadocvs, getEstadocvById, updateEstadocv, deleteEstadocv };
