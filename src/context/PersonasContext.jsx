import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import personasService from '@/services/personasService';
import Swal from 'sweetalert2';
import Cookies from "js-cookie";



const PersonasContext = createContext();

export const PersonasProvider = ({ children }) => {
    const [isInitializedPer, setIsInitializedPer] = useState(false);
    const [isInitPersonal, setIsInitPersonal] = useState(false);
    const [isInitDesvincu, setIsInitDesvincu] = useState(false);
    const [isInitializeActivos, setIsInitializeActivos] = useState(false);
    
    const [users, setPersonas] = useState([]);
    const [usersAct, setPersonasAct] = useState([]);
    const [users10, setDesvincu] = useState([]);
    const [personal, setPersonal] = useState([]);
    const [persona, setPersona] = useState(null);
    const [selectPer, setSelectPer] = useState(null);
    const [assing, setAssing] = useState(null);
    const [loadingPer, setLoading] = useState(false);

    const fetchPersonas = async () => {
        setLoading(true);
        try {
            const response = await personasService.getPersonas();
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
    
    // Obtener todo el persona del usuario
    const fetchListPersonas = async () => {
        setLoading(true);
        const usuario = Cookies.get("user"); // Obtiene la cookie "user"
        const usuarioJSON = usuario ? JSON.parse(usuario) : null; // Convierte a JSON si existe
        try {
            const response = await personasService.listPersonalById(usuarioJSON.iduser);
            if (response.data && Array.isArray(response.data.data)) {
                setPersonal(response.data.data); // Asegura que personas sea un arreglo
            } else {
                setPersonal([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setPersonal([]);
        } finally {
            setLoading(false);
            setIsInitPersonal(true); // Marcar como inicializado
        }
    };
    const getPerActivas = async () => {
        // if(usersAct)return;
        setLoading(true);
        try {
            const response = await personasService.getPerActivas();
            if (response.data && Array.isArray(response.data.data)) {
                console.log('personal activo');
                console.log(response.data.data);
                setPersonasAct(response.data.data); // Asegura que personas sea un arreglo
            } else {
                setPersonasAct([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setPersonasAct([]);
        } finally {
            setLoading(false);
            setIsInitializeActivos(true); // Marcar como inicializado
        }
    };
    const getDesvinculados = async () => {
        // if(isInitializedPer)return;
        setLoading(true);
        try {
            const response = await personasService.getDesvinculados();
            if (response.data && Array.isArray(response.data.data)) {
                console.log('personas para vacaciones');
                console.log(response.data.data);
                setDesvincu(response.data.data); // Asegura que personas sea un arreglo
            } else {
                setDesvincu([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setDesvincu([]);
        } finally {
            setLoading(false);
            setIsInitDesvincu(true); // Marcar como inicializado
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
        const newData={
            ...userData,
            estado:'A'
        }
        try {
            const response = await personasService.createAsignacion(newData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchPersonas();
                await fetchListPersonas();
                await getPerActivas();
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
        const newData={
            ...userData,
            estado:'A'
        }
        try {
            const response = await personasService.changeAssignment(newData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchPersonas();
                await fetchListPersonas();
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
    // Obtener un persona por ID
    const showPersonalById = async (id) => {
        setLoading(true);
        try {
            const response = await personasService.showPersonalById(id);
    
            if (response.status === 200) {
                // Persona encontrada
                setSelectPer(response.data.data);
                return response.data.data;
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
    
                switch (status) {
                    case 404: {
                        // Persona no encontrada
                        Swal.fire({
                            icon: "warning",
                            title: "Persona no encontrada",
                            text: data.message || "No se encontró ninguna persona con este ID.",
                        });
                        break;
                    }
                    case 500: {
                        // Error interno del servidor
                        Swal.fire({
                            icon: "error",
                            title: "Error del Servidor",
                            text: data.message || "Ocurrió un error interno. Inténtalo nuevamente.",
                        });
                        break;
                    }
                    default: {
                        // Otros errores no previstos
                        Swal.fire({
                            icon: "error",
                            title: "Error Desconocido",
                            text: data.message || "Algo salió mal. Inténtalo más tarde.",
                        });
                        break;
                    }
                }
            } else {
                // Error de conexión o sin respuesta del servidor
                Swal.fire({
                    icon: "error",
                    title: "Error de Conexión",
                    text: "No se recibió respuesta del servidor. Por favor, verifica tu conexión a internet.",
                });
            }
    
            return null; // En caso de error, devolver null
        } finally {
            setLoading(false); // Finalizar el indicador de carga
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
                await fetchListPersonas();
                await getDesvinculados();
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
    // Registro de actualizacion de desvinculacion
    const updateEndDate = async (userData) => {
        setLoading(true);
        // Verifica si la fecha de desvinculacion existe
        if (userData.enddate) {
            // Divide la fecha por los guiones
            const [day, month, year] = userData.enddate.split('-');
            // Reorganiza la fecha en formato 'YYYY-MM-DD'
            userData.enddate = `${year}-${month}-${day}`;
        }
        const newData={
            ...userData,
            estado:'D'
        }
        try {
            const response = await personasService.updateEndDate(userData.idassig, newData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await getPerActivas();
                await fetchListPersonas();
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
        const newData={
            ...userData,
            estado:'A'
        }
        try {
            const response = await personasService.updateAsignacion(userData.idassig, newData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchPersonas();
                await fetchListPersonas();
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
                                           getPerActivas,
                                           usersAct,
                                           updateEndDate,
                                           showPersonalById,
                                           selectPer,
                                           getDesvinculados,
                                           isInitDesvincu,
                                           users10,
                                           fetchListPersonas,
                                           personal,
                                           isInitPersonal,
                                           isInitializeActivos
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
