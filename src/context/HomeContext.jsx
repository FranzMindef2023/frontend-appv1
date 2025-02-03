import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import homeService from '@/services/homeService';
import Swal from 'sweetalert2';



const HomeContext = createContext();

export const HomesProvider = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isInitialcount, setIsInitialcount] = useState(false);
    const [isInitialPersonal, setIsInitialPersonal] = useState(false);
    const [isInitialNovedades, setIsInitialNovedades] = useState(false);

    const [users, setUsers] = useState([]);
    const [userscount, setUsersCount] = useState([]);
    const [personascount, setPersonasCount] = useState([]);
    const [novedadescount, setNovedadesCount] = useState([]);

    const [loading, setLoading] = useState(false);


    // Obtener todos los roles
    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const response = await homeService.userSeguimientorrhh();
            if (response.data && Array.isArray(response.data.data)) {
                console.log(response.data.data);
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

    // Obtener cantidad de usuarios activos
    const fetchUsuariosCount = async () => {
        setLoading(true);
        try {
            const response = await homeService.userhomecuadros();
            if (response.data) {
                console.log('usuarios');
                console.log(response.data.data);
                setUsersCount(response.data.data); // Asegura que users sea un arreglo
            } else {
                setUsersCount([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setUsersCount([]);
        } finally {
            setLoading(false);
            setIsInitialcount(true);
        }
    };
    // Obtener cantidad de personal activos
    const fetchPersonalCount = async () => {
        setLoading(true);
        try {
            const response = await homeService.countpersonal();
            if (response.data) {
                console.log('personal');
                console.log(response.data.total);
                setPersonasCount(response.data.total); // Asegura que users sea un arreglo
            } else {
                setPersonasCount([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setPersonasCount([]);
        } finally {
            setLoading(false);
            setIsInitialPersonal(true);
        }
    };
    // Obtener cantidad de personal activos
    const fetchNovedadesCount = async () => {
        setLoading(true);
        try {
            const response = await homeService.countnovedades();
            if (response.data) {
                console.log('novedades');
                console.log(response.data.total);
                setNovedadesCount(response.data.total); // Asegura que users sea un arreglo
            } else {
                setNovedadesCount([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setNovedadesCount([]);
        } finally {
            setLoading(false);
            setIsInitialNovedades(true);
        }
    };

    return (
        <HomeContext.Provider value={{ users, 
                                        userscount, 
                                        fetchUsuarios, 
                                        loading, 
                                        isInitialized,
                                        fetchUsuariosCount, 
                                        isInitialcount,
                                        fetchPersonalCount,
                                        isInitialPersonal,
                                        personascount,
                                        fetchNovedadesCount,
                                        isInitialNovedades,
                                        novedadescount}}>
            {children}
            {loading && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner label="Loading..." color="warning" />
                </div>
            )}
        </HomeContext.Provider>
    );
};

export const useHomes = () => useContext(HomeContext);
