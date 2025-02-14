import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import novedadesService from '@/services/novedadesService';
import vacacionesService from '@/services/vacacionesService';
import Swal from 'sweetalert2';
import Cookies from "js-cookie";



const NovedadesContext = createContext();

export const NovedadesProvider = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isInitPermisos, setIsInitPermisos] = useState(false);
    const [isInitNovedades, setIsInitNovedades] = useState(false);
    const [permisos, setPermisos] = useState([]);
    const [novedades, setNovedades] = useState([]);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    // Obtener todos los roles
    const fetchNovedades = async () => {
        setLoading(true);
        try {
            const response = await novedadesService.getNovedades();
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
        }
    };
    
    // Crear nuevo permiso
    const createNovedad = async (userData) => {
        setLoading(true);
        const usuario = Cookies.get("user"); // Obtiene la cookie "user"
        const usuarioJSON = usuario ? JSON.parse(usuario) : null;
        const newData={
            ...userData,
            iduserreg:usuarioJSON.iduser
        }
        try {
            const response = await novedadesService.createNovedad(newData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchPermisos();
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
    // Crear nuevo permiso
    const storeMassive = async (userData) => {
        setLoading(true);
        const usuario = Cookies.get("user"); // Obtiene la cookie "user"
        const usuarioJSON = usuario ? JSON.parse(usuario) : null; // Convierte a JSON si existe
        const datos = {
                        iduser: usuarioJSON.iduser, // ID del usuario autenticado
                        partes: userData
                    };
        try {
            const response = await novedadesService.storeMassive(datos);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchNovedades();
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
    // Crear vacaciones para gestion actual
    const storeVacaciones = async (userData) => {
        setLoading(true);
        const datos = {
                    vacacion: userData
                    };
        try {
            const response = await vacacionesService.vacaciones(datos);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                // await fetchNovedades();
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
    const fetchPermisos = async () => {
        setLoading(true);
        const usuario = Cookies.get("user"); // Obtiene la cookie "user"
        const usuarioJSON = usuario ? JSON.parse(usuario) : null; // Convierte a JSON si existe
        try {
            const response = await novedadesService.listPersonalPermisos(usuarioJSON.iduser);
            console.log(response.data.data);
            if (response.data && Array.isArray(response.data.data)) {
                setPermisos(response.data.data); // Asegura que personas sea un arreglo
            } else {
                setPermisos([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setPermisos([]);
        } finally {
            setLoading(false);
            setIsInitPermisos(true); // Marcar como inicializado
        }
    };
    const fetchPerNovedades = async () => {
        setLoading(true);
        const usuario = Cookies.get("user"); // Obtiene la cookie "user"
        const usuarioJSON = usuario ? JSON.parse(usuario) : null; // Convierte a JSON si existe
        try {
            const response = await novedadesService.listPeopleParteDiaria(usuarioJSON.iduser);
            // console.log(response.data.data);
            if (response.data && Array.isArray(response.data.data)) {
                setNovedades(response.data.data); // Asegura que personas sea un arreglo
                return response.data.data;
            } else {
                setNovedades([]); // Si no es un arreglo, inicializa vacío
                return [];
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setNovedades([]);
            return [];
        } finally {
            setLoading(false);
            setIsInitNovedades(true); // Marcar como inicializado
        }
    };
    // Obtener un rol por ID
    const getNovedadById = async (id) => {
        setLoading(true);
        try {
            const response = await novedadesService.getNovedadById(id);
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
    const updateNovedad = async (userData) => {
        setLoading(true);
        try {
            const response = await novedadesService.updateNovedad(userData.idnovedad,userData);
            if (response.status === 200) {
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchPermisos();
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
    const deleteNovedad = async (id) => {
        setLoading(true);
        try {
            await novedadesService.deleteNovedad(id);
            await fetchNovedades();
            // showNotification('success', 'Role deleted successfully');
        } catch (error) {
            // showNotification('error', 'Error deleting role. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // Obtener un rol por ID
    const getVerificadorId = async (idper,idvac) => {
        setLoading(true);
        try {
            const response = await novedadesService.getVerificadorvacaciones(idper,idvac);
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error fetching role details. Please try again.');
            return null;
        } finally {
            setLoading(false);
        }
    };
    const getVerificadorIdFecha = async (idper,idvac,fecha) => {
        setLoading(true);
        try {
            const response = await novedadesService.getVerificadorVacacionesHoras(idper,idvac,fecha);
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error fetching role details. Please try again.');
            return null;
        } finally {
            setLoading(false);
        }
    };
    const getVerificadorIdCantidad = async (idper,idvac,fecha,fechafin) => {
        setLoading(true);
        try {
            const response = await novedadesService.getVerificadorVacacionesDiasVigentes(idper,idvac,fecha, fechafin);
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error fetching role details. Please try again.');
            return null;
        } finally {
            setLoading(false);
        }
    };
    return (
        <NovedadesContext.Provider value={{ users, user, 
                                            createNovedad, 
                                            getNovedadById, 
                                            updateNovedad, 
                                            deleteNovedad, 
                                            fetchNovedades, 
                                            loading, 
                                            isInitialized,
                                            isInitPermisos,
                                            permisos,
                                            fetchPermisos ,
                                            fetchPerNovedades,
                                            novedades,
                                            isInitNovedades,
                                            storeMassive,
                                            storeVacaciones,
                                            
                                            getVerificadorId,
                                            getVerificadorIdFecha,
                                            getVerificadorIdCantidad}}>
            {children}
            {loading && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner label="Loading..." color="warning" />
                </div>
            )}
        </NovedadesContext.Provider>
    );
};

export const useNovedades = () => useContext(NovedadesContext);
