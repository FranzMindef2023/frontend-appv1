import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import expedicionesService from '@/services/expedicionesService';
import Swal from 'sweetalert2';



const ExpedicionesContext = createContext();

export const ExpedidosProvider = ({ children }) => {
    const [isInitializedExp, setIsInitializedExp] = useState(false);
    const [expedidos, setExpedidos] = useState([]);
    const [exped, setExp] = useState(null);
    const [loading, setLoading] = useState(false);


    // Obtener todos los roles
    const fetchExpedidos = async () => {
        if(isInitializedExp)return;
        setLoading(true);
        try {
            const response = await expedicionesService.getExpedicions();
            if (response.data && Array.isArray(response.data.data)) {
                setExpedidos(response.data.data); // Asegura que users sea un arreglo
            } else {
                setExpedidos([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setExpedidos([]);
        } finally {
            setLoading(false);
            setIsInitializedExp(true); // Marcar como inicializado
        }
    };
    // Crear un rol
    const createExpedicion = async (userData) => {
        setLoading(true);
        try {
            const response = await expedicionesService.createExpedicion(userData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchExpedidos();
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
    const getExpedido = async (id) => {
        setLoading(true);
        try {
            const response = await expedicionesService.getExpedicionById(id);
            setExp(response.data);
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error fetching role details. Please try again.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar un rol
    const updateExpedicion = async (status, userData) => {
        const newData={status:status,rol:userData.rol}
        setLoading(true);
        try {
            const response = await expedicionesService.updateExpedicion(userData.id, newData);
            await fetchExpedidos();
            // showNotification('success', response.data.message || 'Role updated successfully');
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error updating role. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // Actualizar un rol
    const updateExpedicionData = async (status, userData) => {
        const newData={status:status,rol:userData.rol}
        setLoading(true);
        // try {
        //     const response = await expedicionesService.updateExpedicion(userData.id, newData);
        //     await fetchExpedidos();
        //     // showNotification('success', response.data.message || 'Role updated successfully');
        //     return response.data;
        // } catch (error) {
        //     // showNotification('error', 'Error updating role. Please try again.');
        // } finally {
        //     setLoading(false);
        // }
        try {
            const response = await expedicionesService.updateExpedicion(userData.id, newData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchExpedidos();
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
    const deleteExpedicion = async (id) => {
        setLoading(true);
        try {
            await expedicionesService.deleteExpedicion(id);
            await fetchExpedidos();
            // showNotification('success', 'Role deleted successfully');
        } catch (error) {
            // showNotification('error', 'Error deleting role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ExpedicionesContext.Provider value={{ expedidos, exped, createExpedicion, getExpedido,updateExpedicionData, updateExpedicion, deleteExpedicion, fetchExpedidos, loading, isInitializedExp }}>
            {children}
            {loading && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner label="Loading..." color="warning" />
                </div>
            )}
        </ExpedicionesContext.Provider>
    );
};

export const useExpedido = () => useContext(ExpedicionesContext);
