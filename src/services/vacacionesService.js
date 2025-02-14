import api from '@/api/axios';


// Crear registro de parte diaria
const vacaciones = (data) => api.post('/vacaciones', data);


export default { vacaciones};
