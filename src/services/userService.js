// src/services/userService.js
import api from '@/api/axios';

// Crear un nuevo usuario
export const createUser = (user) => api.post('/usuarios', user);
// asignar roles
export const createUserRols = (user) => api.post('/roldeusuario', user);
// Crear un nuevo accesos
export const createAcceso = (user) => api.post('/registraracceso', user);
// Obtener todos los usuarios
export const getUsers = () => api.get('/usuarios');
// Obtener todos los usuarios con cargos y grados
export const getUserindex = () => api.get('/userindex');

// Obtener un usuario por su ID
export const getUserById = (id) => api.get(`/usuarios/${id}`);

// Actualizar un usuario por su ID 
export const updateUser = (id, userData) => api.put(`/usuarios/${id}`, userData);
export const updateStatusUser = (id, userData) => api.put(`/updatestatususer/${id}`, userData);

// Eliminar un usuario por su ID
export const deleteUser = (id) => api.delete(`/usuarios/${id}`);
// Eliminar un acceso de usuario por su ID
export const deleteAcceso = (id,idorg) => api.delete(`/eliminaracceso/${id}/${idorg}`);
// Roles asignados
const getrolesasig = (id) => api.get(`/showroluser/${id}`);

export default { createUser, 
                getUsers, 
                getUserById, 
                updateUser, 
                deleteUser,
                getrolesasig, 
                createUserRols,
                getUserindex,
                createAcceso,
                deleteAcceso,
                updateStatusUser};
