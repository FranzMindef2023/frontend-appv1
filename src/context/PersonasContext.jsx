import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import personasService from '@/services/personasService';
import Swal from 'sweetalert2';



const PersonasContext = createContext();

export const PersonasProvider = ({ children }) => {
    const [isInitializedPer, setIsInitializedPer] = useState(false);
    const [users, setPersonas] = useState([]);
    const [persona, setPersona] = useState(null);
    const [assing, setAssing] = useState(null);
    const [loadingPer, setLoading] = useState(false);



    const fetchPersonas = async () => {
        if(isInitializedPer)return;
        setLoading(true);
        try {
            const response = await personasService.getPersonas();
            if (response.data && Array.isArray(response.data.data)) {
                console.log('desde contxto personas');
                console.log(response.data.data);
                setPersonas(response.data.data); // Asegura que personas sea un arreglo
            } else {
                setPersonas([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setPersonas([]);
        } finally {
            setLoading(false);
            setIsInitializedPer(true); // Marcar como inicializado
        }
    };
    const getPerActivas = async () => {
        if(isInitializedPer)return;
        setLoading(true);
        try {
            const response = await personasService.getPerActivas();
            if (response.data && Array.isArray(response.data.data)) {
                setPersonas(response.data.data); // Asegura que personas sea un arreglo
            } else {
                setPersonas([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setPersonas([]);
        } finally {
            setLoading(false);
            setIsInitializedPer(true); // Marcar como inicializado
        }
    };
    // Crear persona
    const createPersona = async (userData) => {
        setLoading(true);
        // Verifica si la fecha de nacimiento existe
        if (userData.fechnacimeinto) {
            // Divide la fecha por los guiones
            const [day, month, year] = userData.fechnacimeinto.split('-');
            // Reorganiza la fecha en formato 'YYYY-MM-DD'
            userData.fechnacimeinto = `${year}-${month}-${day}`;
        }
        // Verifica si la fecha de nacimiento existe
        if (userData.fechaegreso) {
            // Divide la fecha por los guiones
            const [day, month, year] = userData.fechaegreso.split('-');
            // Reorganiza la fecha en formato 'YYYY-MM-DD'
            userData.fechaegreso = `${year}-${month}-${day}`;
        }
        try {
            const response = await personasService.createPersona(userData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchPersonas();
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
    // Crear la asignacion
    const createAsignacion = async (userData) => {
        setLoading(true);
        
        // Verifica si la fecha de nacimiento existe
        if (userData.startdate) {
            // Divide la fecha por los guiones
            const [day, month, year] = userData.startdate.split('-');
            // Reorganiza la fecha en formato 'YYYY-MM-DD'
            userData.startdate = `${year}-${month}-${day}`;
        }
        try {
            const response = await personasService.createAsignacion(userData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchPersonas();
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
                            createPersona
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
    // Crear persona
    const changeAssignment = async (userData) => {
        setLoading(true);
        // Verifica si la fecha de nacimiento existe
        if (userData.startdate) {
            // Divide la fecha por los guiones
            const [day, month, year] = userData.startdate.split('-');
            // Reorganiza la fecha en formato 'YYYY-MM-DD'
            userData.startdate = `${year}-${month}-${day}`;
        }
        try {
            const response = await personasService.changeAssignment(userData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchPersonas();
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
    const getPersonaById = async (id) => {
        setLoading(true);
        try {
            const response = await personasService.getPersonaById(id);
            setPersona(response.data);
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error fetching role details. Please try again.');
            return null;
        } finally {
            setLoading(false);
        }
    };
    // Obtener un asignacion por ID persona
    const getshowAssignments = async (userData) => {
        setLoading(true);
        try {
            const response = await personasService.getshowAssignments(userData.id);
            setAssing(response.data.data);
            return response.data.data;
        } catch (error) {
            // showNotification('error', 'Error fetching role details. Please try again.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar un rol
    const updatePersona = async (userData) => {
        // console.log(userData);
        // return true;
        setLoading(true);
        // Verifica si la fecha de nacimiento existe
        if (userData.fechnacimeinto) {
            // Divide la fecha por los guiones
            const [day, month, year] = userData.fechnacimeinto.split('-');
            // Reorganiza la fecha en formato 'YYYY-MM-DD'
            userData.fechnacimeinto = `${year}-${month}-${day}`;
        }
        // Verifica si la fecha de nacimiento existe
        if (userData.fechaegreso) {
            // Divide la fecha por los guiones
            const [day, month, year] = userData.fechaegreso.split('-');
            // Reorganiza la fecha en formato 'YYYY-MM-DD'
            userData.fechaegreso = `${year}-${month}-${day}`;
        }
        try {
            const response = await personasService.updatePersona(userData.id, userData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchPersonas();
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
                        createPersona          // Manejar otros errores no esperados
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

    // Actualizar un asignacion
    const updateAsignacion = async (userData) => {
        setLoading(true);
        // Verifica si la fecha de nacimiento existe
        if (userData.startdate) {
            // Divide la fecha por los guiones
            const [day, month, year] = userData.startdate.split('-');
            // Reorganiza la fecha en formato 'YYYY-MM-DD'
            userData.startdate = `${year}-${month}-${day}`;
        }
        try {
            const response = await personasService.updateAsignacion(userData.idassig, userData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchPersonas();
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
                        createPersona          // Manejar otros errores no esperados
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
    const deletePersona = async (id) => {
        setLoading(true);
        try {
            await personasService.deletePersona(id);
            await fetchPersonas();
            // showNotification('success', 'Role deleted successfully');
        } catch (error) {
            // showNotification('error', 'Error deleting role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PersonasContext.Provider value={{ users, 
                                           persona, 
                                           createPersona, 
                                           getPersonaById, 
                                           updatePersona, 
                                           deletePersona, 
                                           fetchPersonas, 
                                           loadingPer, 
                                           isInitializedPer, 
                                           createAsignacion,
                                           assing,
                                           getshowAssignments,
                                           updateAsignacion,
                                           changeAssignment,
                                           getPerActivas
                                           }}>
            {children}
            {loadingPer && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner label="Loading..." color="warning" />
                </div>
            )}
        </PersonasContext.Provider>
    );
};

export const usePersonas = () => useContext(PersonasContext);
