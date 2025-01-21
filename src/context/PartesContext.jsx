import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import partesService from '@/services/partesService';
import Swal from 'sweetalert2';



const PartesContext = createContext();

export const PartesProvider = ({ children }) => {
    const [isInitialPartes, setIsInitialPartes] = useState(false);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    // Obtener partes enviados del usuario
    const fetchPartes = async () => {
        setLoading(true);
        const usuario = sessionStorage.getItem('user');
        const usuarioJSON = JSON.parse(usuario);
        try {
            const response = await partesService.getIndexReporPartes(usuarioJSON.iduser);
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
            setIsInitialPartes(true);
        }
    };
    //descargar en formato pdf la demostracion
    const downloadPDF = async (fecha) => {
        const usuario = sessionStorage.getItem('user');
        const usuarioJSON = JSON.parse(usuario);
        setLoading(true);
        try {
          const response = await partesService.downloadReporPartePDF(usuarioJSON.iduser, fecha);
    
          // Crear un enlace para descargar el archivo
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `reporte-novedades-${fecha}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
    
          setLoading(false);
          return { success: true };
        } catch (error) {
          console.error('Error al descargar el PDF:', error);
          setLoading(false);
          return { success: false, error };
        }
    };









    return (
        <PartesContext.Provider value={{ users, 
                                            user,  
                                            fetchPartes, 
                                            loading, 
                                            isInitialPartes,
                                            downloadPDF }}>
            {children}
            {loading && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner label="Loading..." color="warning" />
                </div>
            )}
        </PartesContext.Provider>
    );
};

export const usePartes= () => useContext(PartesContext);
