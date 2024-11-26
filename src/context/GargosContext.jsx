import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import cargosService from '@/services/cargosService';
import Swal from 'sweetalert2';



const CargosContext = createContext();

export const CargosProvider = ({ children }) => {
    const [isInitializedCar, setIsInitializedCar] = useState(false);
    const [cargos, setCargos] = useState([]);
    const [cargo, setCargo] = useState(null);
    const [loading, setLoading] = useState(false);


    // Obtener todos los Cargos
    const fetchCargos = async () => {
        setLoading(true);
        try {
            const response = await cargosService.getCargos();
            if (response.data && Array.isArray(response.data.data)) {
                setCargos(response.data.data); // Asegura que users sea un arreglo
            } else {
                setCargos([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching Cargos:", error);
            setCargos([]);
        } finally {
            setLoading(false);
            setIsInitializedCar(true); // Marcar como inicializado
        }
    };
    // Crear un rol
    const createCargo = async (userData) => {
        setLoading(true);
        try {
            const response = await cargosService.createCargo(userData);
           console.log(response.data);
            if (response.status === 200) {
                console.log();
                Swal.fire("¡Éxito!", response.data.message, "success");
                await fetchCargos();
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
    const getCargo = async (id) => {
        setLoading(true);
        try {
            const response = await cargosService.getCargoById(id);
            setCargo(response.data);
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error fetching role details. Please try again.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar un rol
    const updateCargo = async (id, userData) => {
        setLoading(true);
        try {
            const response = await cargosService.updateCargo(id, userData);
            await fetchCargos();
            // showNotification('success', response.data.message || 'Role updated successfully');
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error updating role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Eliminar un rol
    const deleteCargo = async (id) => {
        setLoading(true);
        try {
            await cargosService.deleteCargo(id);
            await fetchCargos();
            // showNotification('success', 'Role deleted successfully');
        } catch (error) {
            // showNotification('error', 'Error deleting role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CargosContext.Provider value={{ cargos, cargo, createCargo, getCargo, updateCargo, deleteCargo, fetchCargos, loading, isInitializedCar }}>
            {children}
            {loading && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner label="Loading..." color="warning" />
                </div>
            )}
        </CargosContext.Provider>
    );
};

export const useCargo = () => useContext(CargosContext);
