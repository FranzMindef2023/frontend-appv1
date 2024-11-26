import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import organigramaService from '@/services/organigramaService';
import Swal from 'sweetalert2';



const OrganigramaContext = createContext();

export const OrganigramaProvider = ({ children }) => {
    const [isInitializedOrg, setIsInitializedOrg] = useState(false);
    const [organi, setOrga] = useState([]);
    const [org, setOrg] = useState(null);
    const [loading, setLoading] = useState(false);


    // Obtener todos los Organigrama
    const fetchOrganigrama = async () => {
        setLoading(true);
        try {
            const response = await organigramaService.getOrganigramas();
            if (response.data && Array.isArray(response.data.data)) {
                setOrga(response.data.data); // Asegura que users sea un arreglo
            } else {
                setOrga([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching Organigrama:", error);
            setOrga([]);
        } finally {
            setLoading(false);
            setIsInitializedOrg(true); // Marcar como inicializado
        }
    };
    // Crear un rol
    const createOrganigrama = async (userData) => {
        setLoading(true);
        try {
            const response = await organigramaService.createOrganigrama(userData);
           console.log(response.data);
            if (response.status === 200) {
                console.log();
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchOrganigrama();
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
    const getOrganigrama = async (id) => {
        setLoading(true);
        try {
            const response = await organigramaService.getOrganigramaById(id);
            setOrg(response.data);
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error fetching role details. Please try again.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar un rol
    const updateOrganigrama = async (id, userData) => {
        setLoading(true);
        try {
            const response = await organigramaService.updateOrganigrama(id, userData);
            await fetchOrganigrama();
            // showNotification('success', response.data.message || 'Role updated successfully');
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error updating role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Eliminar un rol
    const deleteOrganigrama = async (id) => {
        setLoading(true);
        try {
            await organigramaService.deleteOrganigrama(id);
            await fetchOrganigrama();
            // showNotification('success', 'Role deleted successfully');
        } catch (error) {
            // showNotification('error', 'Error deleting role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <OrganigramaContext.Provider value={{ organi, org, createOrganigrama, getOrganigrama, updateOrganigrama, deleteOrganigrama, fetchOrganigrama, loading, isInitializedOrg }}>
            {children}
            {loading && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner label="Loading..." color="warning" />
                </div>
            )}
        </OrganigramaContext.Provider>
    );
};

export const useOrganigrama = () => useContext(OrganigramaContext);
