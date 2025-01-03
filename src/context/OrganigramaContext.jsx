import React, { createContext, useContext, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import organigramaService from '@/services/organigramaService';
import Swal from 'sweetalert2';



const OrganigramaContext = createContext();

export const OrganigramaProvider = ({ children }) => {
    const [isInitializedOrg, setIsInitializedOrg] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [organi, setOrga] = useState([]);
    const [organPhat, setOrgaPhat] = useState([]);
    const [organAccess, setOrgaAccess] = useState([]);
    const [org, setOrg] = useState(null);
    const [orgChil, setOrgChil] = useState(null);
    const [orgChilphat, setOrgChilPhat] = useState(null);
    const [loading, setLoading] = useState(false);


    // Obtener todos los Organigrama
    const fetchOrganigrama = async () => {
        if(isInitializedOrg)return;
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
    // Obtener todos los Organigrama Padres
    const fetchOrgPhat = async () => {
        if(isInitialized)return;
        setLoading(true);
        try {
            const response = await organigramaService.getOrganigramasPhat();
            if (response.data && Array.isArray(response.data.data)) {
                setOrgaPhat(response.data.data); // Asegura que users sea un arreglo
            } else {
                setOrgaPhat([]); // Si no es un arreglo, inicializa vacío
            }
        } catch (error) {
            console.error("Error fetching Organigrama:", error);
            setOrgaPhat([]);
        } finally {
            setLoading(false);
            setIsInitialized(true); // Marcar como inicializado
        }
    };
    // Obtener todos los Organigrama Padres
    const fetchOrgAccess = async (iduser, idor) => {
        setLoading(true);
        try {
            // Si idor es null, limpiar orgaAccess para cargar nuevos datos
            if (idor === null) {
                setOrgaAccess({});
                return;
            }
            const response = await organigramaService.getShowuseraccesses(iduser, idor);
            if (response.data && Array.isArray(response.data.data)) {
                setOrgaAccess((prev) => ({
                    ...prev,
                    [idor]: response.data.data,
                }));
            } else {
                setOrgaAccess((prev) => ({
                    ...prev,
                    [idor]: [],
                }));
            }
        } catch (error) {
            console.error("Error fetching Organigrama:", error);
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
    // Obtener un rol por ID
    const getOrgByIdPhat = async (id) => {
        setLoading(true);
        try {
            const response = await organigramaService.getOrganigramaByPhat(id);
            setOrgChil(response.data.data);
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error fetching role details. Please try again.');
            return null;
        } finally {
            setLoading(false);
        }
    };
    // Obtener un rol por ID
    const getOrganigramaByHijo = async (id) => {
        setLoading(true);
        try {
            const response = await organigramaService.getOrganigramaByHijo(id);
            setOrgChilPhat(response.data.data);
            return response.data;
        } catch (error) {
            // showNotification('error', 'Error fetching role details. Please try again.');
            return null;
        } finally {
            setLoading(false);
        }
    };



    return (
        <OrganigramaContext.Provider value={{ organi, org,organPhat, getOrganigrama,orgChil,orgChilphat, fetchOrganigrama,fetchOrgPhat,getOrgByIdPhat,getOrganigramaByHijo, loading, isInitializedOrg,isInitialized, fetchOrgAccess,organAccess}}>
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
