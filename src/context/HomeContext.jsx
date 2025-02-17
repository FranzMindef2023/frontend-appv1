import React, { createContext, useContext, useState, useEffect } from 'react';
import { Spinner } from '@nextui-org/react';
import homeService from '@/services/homeService';




const HomeContext = createContext();

export const HomesProvider = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isInitialcount, setIsInitialcount] = useState(false);
    const [isInitialPersonal, setIsInitialPersonal] = useState(false);
    const [isInitialNovedades, setIsInitialNovedades] = useState(false);
    const [isInitialRepart, setIsInitialRepart] = useState(false);
    const [isInitialParte, setIsInitialParte] = useState(false);

    const [users, setUsers] = useState([]);
    const [userscount, setUsersCount] = useState([]);
    const [personascount, setPersonasCount] = useState([]);
    const [novedadescount, setNovedadesCount] = useState([]);
    const [partescount, setPartesCount] = useState([]);
    const [reparticion, setReparticion] = useState([]);

    

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
    // Obtener todos Prtes diarios
    const countpartepersona = async () => {
        setLoading(true);
        try {
            const response = await homeService.countpartepersona();
            if (response.data) {
                console.log('parte');
                console.log(response.data.total);
                setPartesCount(response.data.total); // Asegura que users sea un arreglo
            } else {
                setPartesCount([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setPartesCount([]);
        } finally {
            setLoading(false);
            setIsInitialParte(true);
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
    const fetchReparticion = async () => {
        setLoading(true);
        try {
            const response = await homeService.reparticiones();
            if (response.data && Array.isArray(response.data.data)) {
                console.log(response.data.data);
                setReparticion(response.data.data); // Asegura que users sea un arreglo
            } else {
                setReparticion([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setReparticion([]);
        } finally {
            setLoading(false);
            setIsInitialRepart(true);
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
                                        novedadescount,
                                        fetchReparticion,
                                        isInitialRepart,
                                        reparticion,
                                        countpartepersona,
                                        isInitialParte,
                                        partescount}}>
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
