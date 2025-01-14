import api from '@/api/axios';

// Crear un nuevo rol
const createNovedad = (user) => api.post('/novedades', user);

// Obtener todos los novedades
const getNovedades = () => api.get('/novedades');

// Obtener un rol por ID
const getNovedadById = (id) => api.get(`/novedades/${id}`);
// Obtener personal del usuaro en cargado
const listPersonalPermisos = (id) => api.get(`/listpersonaspermisos/${id}`);
// Obtener personal con novedades
const listPeopleParteDiaria = (id) => api.get(`/listpeoplepartediaria/${id}`);

// Actualizar un rol
const updateNovedad = (id, userData) => api.put(`/novedades/${id}`, userData);

// Eliminar un rol
const deleteNovedad = (id) => api.delete(`/novedades/${id}`);

export default { createNovedad, 
                getNovedades, 
                getNovedadById, 
                updateNovedad, 
                deleteNovedad ,
                listPersonalPermisos,
                listPeopleParteDiaria};
