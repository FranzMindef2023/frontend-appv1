import api from '@/api/axios';

// Crear un nuevo rol
const createRols = (user) => api.post('/roles', user);

// Obtener todos los roles
const getIndexReporPartes = (id) => api.get(`/indexreporpartes/${id}`);
// Descargar reporte PDF de novedades por fecha
// Descargar reporte PDF de novedades por fecha
const downloadReporPartePDF = (iduser, fecha) => {
    return api.get(`/listnovedadesbydate/${iduser}/${fecha}`, {
        responseType: 'blob', // Necesario para manejar la descarga del archivo como un blob
    });
};

// Obtener un rol por ID
const getRolsById = (id) => api.get(`/roles/${id}`);

// Actualizar un rol
const updateRols = (id, userData) => api.put(`/roles/${id}`, userData);

// Eliminar un rol
const deleteRols = (id) => api.delete(`/roles/${id}`);

export default { createRols, 
    getIndexReporPartes, 
    getRolsById, 
    updateRols, 
    deleteRols,
    downloadReporPartePDF };
