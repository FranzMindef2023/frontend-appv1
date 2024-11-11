// src/contexts/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Spinner } from '@nextui-org/react';
import userService from '@/services/userService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga

  // Obtener todos los usuarios al cargar el componente
  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Crear un nuevo usuario
  const createUser = async (userData) => {
    // Establecer el estado de carga y forzar un re-renderizado antes de enviar la solicitud
  setLoading(true);
  
  // Forzar un re-renderizado antes de continuar
  await new Promise((resolve) => setTimeout(resolve, 50)); 

  try {
    const response = await userService.createUser(userData);
    await fetchUsers(); // Actualizar la lista después de crear
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  } finally {
    setLoading(false); // Ocultar el spinner después de que la solicitud haya terminado
  }
  };

  // Obtener un usuario por su ID
  const getUser = async (id) => {
    try {
      const response = await userService.getUserById(id);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };

  // Actualizar un usuario
  const updateUser = async (id, userData) => {
    try {
      const response = await userService.updateUser(id, userData);
      fetchUsers(); // Actualizar la lista después de actualizar
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Eliminar un usuario
  const deleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      fetchUsers(); // Actualizar la lista después de eliminar
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ users, user, createUser, getUser, updateUser, deleteUser, fetchUsers, loading }}>
      {children}
      {loading && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Spinner label="Loading..." color="warning" />
        </div>
      )}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
