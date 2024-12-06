import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import especialidadService from '@/services/especialidadService';
import Swal from 'sweetalert2';



const EspecialidadContext = createContext();

export const EspecialidadProvider = ({ children }) => {
    const [isInitializedEsp, setIsInitializedEsp] = useState(false);
    const [especial, setEsp] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    // Obtener todos los roles
    const fetchEspecialidades = async () => {
        if(isInitializedEsp)return;
        setLoading(true);
        try {
            const response = await especialidadService.getEspecialidadess();
            if (response.data && Array.isArray(response.data.data)) {
                console.log('desde contxto especialidad');
                console.log(response.data.data);
                setEsp(response.data.data); // Asegura que especial sea un arreglo
            } else {
                setEsp([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setEsp([]);
        } finally {
            setLoading(false);
            setIsInitializedEsp(true); // Marcar como inicializado
        }
    };
    // Crear un rol
    const createEspecialidades = async (userData) => {
        setLoading(true);
        try {
            const response = await especialidadService.createEspecialidades(userData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchEspecialidades();
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
    const getEspecialidad = async (id) => {
        setLoading(true);
        try {
            const response = await especialidadService.getEspecialidadesById(id);
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
    const updateEspecialidades = async (status, userData) => {
        const newData={status:status,rol:userData.rol}
        setLoading(true);
        try {
            const response = await especialidadService.updateEspecialidades(userData.id, newData);
            await fetchEspecialidades();
            // showNotification('success', response.data.message || 'Role updated successfully');
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error updating role. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // Actualizar un rol
    const updateEspecialidadesData = async (status, userData) => {
        const newData={status:status,rol:userData.rol}
        setLoading(true);
        try {
            const response = await especialidadService.updateEspecialidades(userData.id, newData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchEspecialidades();
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
    const deleteEspecialidades = async (id) => {
        setLoading(true);
        try {
            await especialidadService.deleteEspecialidades(id);
            await fetchEspecialidades();
            // showNotification('success', 'Role deleted successfully');
        } catch (error) {
            // showNotification('error', 'Error deleting role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <EspecialidadContext.Provider value={{ especial, user, createEspecialidades, getEspecialidad,updateEspecialidadesData, updateEspecialidades, deleteEspecialidades, fetchEspecialidades, loading, isInitializedEsp }}>
            {children}
            {loading && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner label="Loading..." color="warning" />
                </div>
            )}
        </EspecialidadContext.Provider>
    );
};

export const useEspecial = () => useContext(EspecialidadContext);
