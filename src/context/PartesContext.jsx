import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import partesService from '@/services/partesService';
import Swal from 'sweetalert2';
import Cookies from "js-cookie";



const PartesContext = createContext();

export const PartesProvider = ({ children }) => {
    const [isInitialPartes, setIsInitialPartes] = useState(false);
    const [isInitialrrhh, setIsInitialrrhh] = useState(false);
    const [isPermisos, setIsPermisos] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersrrhh, setUsersrrhh] = useState([]);
    const [PermisosSol, setPermisosSol] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    // Obtener partes enviados del usuario
    const fetchPartes = async () => {
        setLoading(true);
        const usuario = Cookies.get("user"); // Obtiene la cookie "user"
        const usuarioJSON = usuario ? JSON.parse(usuario) : null; // Convierte a JSON si existe
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
    // Obtener partes enviados del usuario
    const fetchPartesrrhh = async () => {
        setLoading(true);
        try {
            const response = await partesService.indexReporPartesrrhh();
            if (response.data && Array.isArray(response.data.data)) {
                setUsersrrhh(response.data.data); // Asegura que users sea un arreglo
            } else {
                setUsersrrhh([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setUsersrrhh([]);
        } finally {
            setLoading(false);
            setIsInitialrrhh(true);
        }
    };
    // Obtener partes enviados del usuario
    const fetchPermisosrrhh = async () => {
        setLoading(true);
        try {
            const response = await partesService.listPermisosSolicitados();
            if (response.data && Array.isArray(response.data.data)) {
                setPermisosSol(response.data.data); // Asegura que users sea un arreglo
            } else {
                setPermisosSol([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setPermisosSol([]);
        } finally {
            setLoading(false);
            setIsPermisos(true);
        }
    };
    //descargar en formato pdf la demostracion
    const downloadPDF = async (fecha) => {
        const usuario = Cookies.get("user"); // Obtiene la cookie "user"
        const usuarioJSON = usuario ? JSON.parse(usuario) : null; // Convierte a JSON si existe
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
    //descargar en formato pdf la demostracion
    const downloadPDFUser = async (fecha) => {
        const usuario = Cookies.get("user"); // Obtiene la cookie "user"
        const usuarioJSON = usuario ? JSON.parse(usuario) : null; // Convierte a JSON si existe
        setLoading(true);
        try {
          const response = await partesService.downloadPartUsers(usuarioJSON.iduser, fecha);
    
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
    //descargar papeleta de permisos
    const downloadPDFPermiso = async (id,fecha) => {
        setLoading(true);
        try {
          const response = await partesService.downloadPapeletaPermiso(id);
    
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
    //descargar en formato pdf parte general
    const downloadPDFGeneral = async (fecha) => {
        const usuario = Cookies.get("user"); // Obtiene la cookie "user"
        const usuarioJSON = usuario ? JSON.parse(usuario) : null; // Convierte a JSON si existe
        setLoading(true);
        try {
          const response = await partesService.parteReportsGeneralrrhh(usuarioJSON.iduser, fecha);
    
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
    //descargar en formato pdf demostracion general
    const downloadPDFDemoGeneral = async (fecha) => {
        const usuario = Cookies.get("user"); // Obtiene la cookie "user"
        const usuarioJSON = usuario ? JSON.parse(usuario) : null; // Convierte a JSON si existe
        setLoading(true);
        try {
          const response = await partesService.downloadSolpermisosrrhh(usuarioJSON.iduser, fecha);
    
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
    //descargar en formato pdf demostracion general
    const downloadPDFPlanilla = async (fecha) => {
        setLoading(true);
        try {
          const response = await partesService.downloadPlanillaVacacion();
    
          // Crear un enlace para descargar el archivo
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `reporte-planillaVacaciones.pdf`);
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
                                            downloadPDF,
                                            fetchPartesrrhh,
                                            isInitialrrhh,
                                            usersrrhh,
                                            fetchPermisosrrhh,
                                            isPermisos,
                                            PermisosSol,
                                            downloadPDFGeneral,
                                            downloadPDFUser,
                                            downloadPDFDemoGeneral,
                                            downloadPDFPermiso,
                                            downloadPDFPlanilla}}>
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
