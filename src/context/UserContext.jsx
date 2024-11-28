import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import userService from '@/services/userService';
import Swal from 'sweetalert2';



const UserContext = createContext();

export const UsersProvider = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    // Obtener todos los roles
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers();
            if (response.data && Array.isArray(response.data.data)) {
                setUsers(response.data.data); // Asegura que users sea un arreglo
            } else {
                setUsers([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setUsers([]);
        } finally {
            setLoading(false);
            setIsInitialized(true); // Marcar como inicializado
        }
    };
    // Crear un rol
    const createUser = async (data,org,cargo) => {
      const newData={...data,idorg:org.idorg,idpuesto:cargo.idpuesto};
        setLoading(true);
        try {
            const response = await userService.createUser(newData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchUsers();
                // showNotification('success', response.data.message || 'Role created successfully');
                return response.data;
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 422: {
                        // Manejar errores de validación
                        const errorMessages = Object.entries(data.errors || {})
                            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                            .join("\n");
            
                        Swal.fire({
                            icon: "error",
                            title: "Errores de Validación",
                            text: errorMessages,
                        });
                        break;
                    }
                    case 500: {
                        // Manejar errores internos del servidor
                        Swal.fire({
                            icon: "error",
                            title: "Error del Servidor",
                            text: data.message || "Ocurrió un error interno. Inténtalo nuevamente.",
                        });
                        break;
                    }
                    default: {
                        // Manejar otros errores no esperados
                        Swal.fire({
                            icon: "error",
                            title: "Error Desconocido",
                            text: data.message || "Algo salió mal. Inténtalo más tarde.",
                        });
                        break;
                    }
                }
            } else {
                // Manejar errores donde no hay respuesta del servidor
                Swal.fire({
                    icon: "error",
                    title: "Error de Conexión",
                    text: "No se recibió respuesta del servidor. Por favor, verifica tu conexión a internet.",
                });
            }
            
        } finally {
            setLoading(false);
        }
    };

    // Obtener un rol por ID
    const getUserbyId = async (id) => {
        setLoading(true);
        try {
            const response = await userService.getUserById(id);
            setUser(response.data);
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error fetching role details. Please try again.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar un rol
    const updateUser = async (id, userData) => {
        setLoading(true);
        try {
            const response = await userService.updateUser(id, userData);
            await fetchUsers();
            // showNotification('success', response.data.message || 'Role updated successfully');
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error updating role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Eliminar un rol
    const deleteUser = async (id) => {
        setLoading(true);
        try {
            await userService.deleteUser(id);
            await fetchUsers();
            // showNotification('success', 'Role deleted successfully');
        } catch (error) {
            // showNotification('error', 'Error deleting role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ users, user, createUser, getUserbyId, updateUser, deleteUser, fetchUsers, loading, isInitialized }}>
            {children}
            {loading && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner label="Loading..." color="warning" />
                </div>
            )}
        </UserContext.Provider>
    );
};

export const useUsers = () => useContext(UserContext);
