import api from '@/api/axios';

// Crear un nuevo rol
const createCargo = (user) => api.post('/puestos', user);

// Obtener todos los puestos
const getCargos = () => api.get('/puestos');

// Obtener un rol por ID
const getCargoById = (id) => api.get(`/puestos/${id}`);

// Actualizar un rol
const updateCargo = (id, userData) => api.put(`/puestos/${id}`, userData);

// Eliminar un rol
const deleteCargo = (id) => api.delete(`/puestos/${id}`);

export default { createCargo, getCargos, getCargoById, updateCargo, deleteCargo };
