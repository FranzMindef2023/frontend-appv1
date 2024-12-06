import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import situacionesService from '@/services/situacionesService';
import Swal from 'sweetalert2';



const SituacionesContext = createContext();

export const SituacionesProvider = ({ children }) => {
    const [isInitializedSitua, setIsInitializedSitua] = useState(false);
    const [situaciones, setSituaciones] = useState([]);
    const [situa, setSitua] = useState(null);
    const [loading, setLoading] = useState(false);


    // Obtener todos los roles
    const fetchSituacion = async () => {
        if(isInitializedSitua)return;
        setLoading(true);
        try {
            const response = await situacionesService.getSituacions();
            if (response.data && Array.isArray(response.data.data)) {
                setSituaciones(response.data.data); // Asegura que situaciones sea un arreglo
            } else {
                setSituaciones([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setSituaciones([]);
        } finally {
            setLoading(false);
            setIsInitializedSitua(true); // Marcar como inicializado
        }
    };
    // Crear un rol
    const createSituacion = async (userData) => {
        setLoading(true);
        try {
            const response = await situacionesService.createSituacion(userData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchSituacion();
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
    const getSituacion = async (id) => {
        setLoading(true);
        try {
            const response = await situacionesService.getSituacionById(id);
            setSitua(response.data);
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error fetching role details. Please try again.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar un rol
    const updateSituacion = async (status, userData) => {
        const newData={status:status,rol:userData.rol}
        setLoading(true);
        try {
            const response = await situacionesService.updateSituacion(userData.id, newData);
            await fetchSituacion();
            // showNotification('success', response.data.message || 'Role updated successfully');
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error updating role. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // Actualizar un rol
    const updateSituacionData = async (status, userData) => {
        const newData={status:status,rol:userData.rol}
        setLoading(true);
        // try {
        //     const response = await situacionesService.updateSituacion(userData.id, newData);
        //     await fetchSituacion();
        //     // showNotification('success', response.data.message || 'Role updated successfully');
        //     return response.data;
        // } catch (error) {
        //     // showNotification('error', 'Error updating role. Please try again.');
        // } finally {
        //     setLoading(false);
        // }
        try {
            const response = await situacionesService.updateSituacion(userData.id, newData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchSituacion();
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
    const deleteSituacion = async (id) => {
        setLoading(true);
        try {
            await situacionesService.deleteSituacion(id);
            await fetchSituacion();
            // showNotification('success', 'Role deleted successfully');
        } catch (error) {
            // showNotification('error', 'Error deleting role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SituacionesContext.Provider value={{ situaciones, situa, createSituacion, getSituacion,updateSituacionData, updateSituacion, deleteSituacion, fetchSituacion, loading, isInitializedSitua }}>
            {children}
            {loading && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner label="Loading..." color="warning" />
                </div>
            )}
        </SituacionesContext.Provider>
    );
};

export const useSitua = () => useContext(SituacionesContext);
