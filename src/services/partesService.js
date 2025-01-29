import api from '@/api/axios';

// Obtener todos los roles
const getIndexReporPartes = (id) => api.get(`/indexreporpartes/${id}`);
// Descargar reporte PDF de novedades por fecha usuario
const downloadReporPartePDF = (iduser, fecha) => {
    return api.get(`/listnovedadesbydate/${iduser}/${fecha}`, {
        responseType: 'blob', // Necesario para manejar la descarga del archivo como un blob
    });
};
// Descargar reporte PDF de novedades por fecha usuario
const downloadPartUsers = (iduser, fecha) => {
    return api.get(`/partereportsusers/${iduser}/${fecha}`, {
        responseType: 'blob', // Necesario para manejar la descarga del archivo como un blob
    });
};
// Descargar reporte PDF de parte general  
const parteReportsGeneralrrhh = (iduser, fecha) => {
    return api.get(`/partereportsgeneral/${iduser}/${fecha}`, {
        responseType: 'blob', // Necesario para manejar la descarga del archivo como un blob
    });
};
// Descargar reporte PDF de parte general  
const downloadSolpermisosrrhh = (iduser, fecha) => {
    return api.get(`/solpermisosrrhh/${iduser}/${fecha}`, {
        responseType: 'blob', // Necesario para manejar la descarga del archivo como un blob
    });
};

// Descargar permiso del personal 
const downloadPapeletaPermiso = (id) => {
    return api.get(`/papeletapermiso/${id}`, {
        responseType: 'blob', // Necesario para manejar la descarga del archivo como un blob
    });
};
// Obtener todos las novedades para rrhh
const indexReporPartesrrhh = () => api.get(`/indexreporpartesrrhh`);
// Obtener parte por fecha para rrhh
const listPermisosSolicitados = () => api.get(`/listpermisossolicitados`);

export default { 
    getIndexReporPartes, 
    downloadReporPartePDF,
    parteReportsGeneralrrhh,
    indexReporPartesrrhh,
    listPermisosSolicitados,
    downloadPartUsers,
    downloadPapeletaPermiso,
    downloadSolpermisosrrhh };
