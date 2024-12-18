import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import generosService from '@/services/generosService';
import Swal from 'sweetalert2';



const GenerosContext = createContext();

export const GenerosProvider = ({ children }) => {
    const [isInitializedGen, setIsInitializedGen] = useState(false);
    const [sexos, setSexos] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    // Obtener todos los roles
    const fetchSexos = async () => {
        if(isInitializedGen)return;
        setLoading(true);
        try {
            const response = await generosService.getSexoss();
            if (response.data && Array.isArray(response.data.data)) {
                console.log('desde contxto generos');
                console.log(response.data.data);
                setSexos(response.data.data); // Asegura que sexos sea un arreglo
            } else {
                setSexos([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setSexos([]);
        } finally {
            setLoading(false);
            setIsInitializedGen(true); // Marcar como inicializado
        }
    };
    // Crear un rol
    const createSexos = async (userData) => {
        setLoading(true);
        try {
            const response = await generosService.createSexos(userData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchSexos();
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
    const getSexo = async (id) => {
        setLoading(true);
        try {
            const response = await generosService.getSexosById(id);
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
    const updateSexos = async (status, userData) => {
        const newData={status:status,rol:userData.rol}
        setLoading(true);
        try {
            const response = await generosService.updateSexos(userData.id, newData);
            await fetchSexos();
            // showNotification('success', response.data.message || 'Role updated successfully');
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error updating role. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // Actualizar un rol
    const updateSexosData = async (status, userData) => {
        const newData={status:status,rol:userData.rol}
        setLoading(true);
        try {
            const response = await generosService.updateSexos(userData.id, newData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchSexos();
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
    const deleteSexos = async (id) => {
        setLoading(true);
        try {
            await generosService.deleteSexos(id);
            await fetchSexos();
            // showNotification('success', 'Role deleted successfully');
        } catch (error) {
            // showNotification('error', 'Error deleting role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GenerosContext.Provider value={{ sexos, user, createSexos, getSexo,updateSexosData, updateSexos, deleteSexos, fetchSexos, loading, isInitializedGen }}>
            {children}
            {loading && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner label="Loading..." color="warning" />
                </div>
            )}
        </GenerosContext.Provider>
    );
};

export const useGeneros = () => useContext(GenerosContext);
