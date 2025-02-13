import api from '@/api/axios';

// Crear un nuevo Persona
const createPersona = (user) => api.post('/persona', user);
// Crear un nuevo Asignacion
const createAsignacion = (user) => api.post('/assignments', user);
// Crear un nuevo Asignacion
const changeAssignment = (user) => api.post('/changeAssignment', user);

// Obtener todos los Persona
const getPersonas = () => api.get('/persona');
// Obtener todos los Persona activas
const getPerActivas = () => api.get('/indexpersonal');
// Obtener todos los Persona desvinculadas en la gestion actual
const getDesvinculados = () => api.get('/indexpersonalgeneral');
// Obtener todos los Asignaciones
const getshowAssignments = (id) => api.get(`/showAssignments/${id}`);
// Obtener un Persona por ID
const getPersonaById = (id) => api.get(`/persona/${id}`);
// Obtener un Persona por ID
const showPersonalById = (id) => api.get(`/showpersonal/${id}`);

// Obtener personal del usuaro en cargado
const listPersonalById = (id) => api.get(`/listpersonasbyuseraccess/${id}`);

// Actualizar un Persona
const updatePersona = (id, userData) => api.put(`/persona/${id}`, userData);

// registra la fecha y motivo de la desvinculacion
const updateEndDate = (id, userData) => api.put(`/updateEndDate/${id}`, userData);

// Actualizar un Persona
const updateAsignacion = (id, userData) => api.put(`/assignments/${id}`, userData);

// Eliminar un Persona
const deletePersona = (id) => api.delete(`/persona/${id}`);

export default { createPersona, 
                getPersonas, 
                getPersonaById, 
                updatePersona, 
                deletePersona, 
                createAsignacion, 
                getshowAssignments, 
                updateAsignacion, 
                changeAssignment,
                getPerActivas,
                updateEndDate,
                showPersonalById,
                getDesvinculados,
                listPersonalById};
