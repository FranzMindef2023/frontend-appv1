// src/services/userService.js
import api from '@/api/axios';

// Crear un nuevo usuario
export const createUser = (user) => api.post('/usuarios', user);

// Obtener todos los usuarios
export const getUsers = () => api.get('/usuarios');

// Obtener un usuario por su ID
export const getUserById = (id) => api.get(`/usuarios/${id}`);

// Actualizar un usuario por su ID
export const updateUser = (id, userData) => api.put(`/usuarios/${id}`, userData);

// Eliminar un usuario por su ID
export const deleteUser = (id) => api.delete(`/usuarios/${id}`);
// Roles asignados
const getrolesasig = (id) => api.get(`/showroluser/${id}`);

export default { createUser, getUsers, getUserById, updateUser, deleteUser,getrolesasig };
