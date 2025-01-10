import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import rolesService from '@/services/rolesService';
import Swal from 'sweetalert2';



const RolesContext = createContext();

export const RolesProvider = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    // Obtener todos los roles
    const fetchRols = async () => {
        setLoading(true);
        try {
            const response = await rolesService.getRolss();
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
            setIsInitialized(true);
        }
    };
    // Crear un rol
    const createRols = async (userData) => {
        setLoading(true);
        try {
            const response = await rolesService.createRols(userData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchRols();
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
    const getRols = async (id) => {
        setLoading(true);
        try {
            const response = await rolesService.getRolsById(id);
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
    const updateRols = async (status, userData) => {
        const newData={status:status,rol:userData.rol}
        setLoading(true);
        try {
            const response = await rolesService.updateRols(userData.id, newData);
            await fetchRols();
            // showNotification('success', response.data.message || 'Role updated successfully');
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error updating role. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // Actualizar un rol
    const updateRolsData = async (status, userData) => {
        const newData={status:status,rol:userData.rol}
        setLoading(true);
        try {
            const response = await rolesService.updateRols(userData.id, newData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchRols();
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

    // Eliminar un rol
    const deleteRols = async (id) => {
        setLoading(true);
        try {
            await rolesService.deleteRols(id);
            await fetchRols();
            // showNotification('success', 'Role deleted successfully');
        } catch (error) {
            // showNotification('error', 'Error deleting role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <RolesContext.Provider value={{ users, user, createRols, getRols,updateRolsData, updateRols, deleteRols, fetchRols, loading, isInitialized }}>
            {children}
            {loading && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner label="Loading..." color="warning" />
                </div>
            )}
        </RolesContext.Provider>
    );
};

export const useRols = () => useContext(RolesContext);
