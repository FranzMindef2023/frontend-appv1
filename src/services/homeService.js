import api from '@/api/axios';


const userSeguimientorrhh = () => api.get('/userseguimientorrhh');
const userhomecuadros = () => api.get('/userhomecuadros');
const countpersonal = () => api.get('/countpersonal');
const countnovedades = () => api.get('/countnovedades');
const countpartepersona = () => api.get('/countpartepersona');
const reparticiones = () => api.get('/reparticiones');
export default { 
    userSeguimientorrhh,
    userhomecuadros,
    countpersonal,
    countnovedades,
    countpartepersona,
    reparticiones
};
