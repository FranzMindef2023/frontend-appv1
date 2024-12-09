import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import selectsService from '@/services/selectsService';
import Swal from 'sweetalert2';



const SelectsContext = createContext();

export const SelectsProvider = ({ children }) => {
    const [isInitializedSelect, setIsInitializedSelect] = useState(false);
    const [selects, setSelects] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    // Obtener todos los roles
    const fetchSelects = async () => {
        if(isInitializedSelect)return;
        setLoading(true);
        try {
            const response = await selectsService.getAllData();
            setSelects(response);
            // setSelects(response.data.data);
            // if (response.data && Array.isArray(response.data.data)) {
            //     console.log('desde contxto selects');
            //     console.log(response.data.data);
            //     setSelects(response.data.data); // Asegura que selects sea un arreglo
            // } else {
            //     setSelects([]); // Si no es un arreglo, inicializa vacío
            // }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setSelects([]);
        } finally {
            setLoading(false);
            setIsInitializedSelect(true); // Marcar como inicializado
        }
    };

    return (
        <SelectsContext.Provider value={{ selects, user, fetchSelects, loading, isInitializedSelect }}>
            {children}
            {loading && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner label="Loading..." color="warning" />
                </div>
            )}
        </SelectsContext.Provider>
    );
};

export const useselects = () => useContext(SelectsContext);
