import api from '@/api/axios';

const login = (values) => api.post('/auth/login', values);
const logout = () => api.post('/auth/logout');
const register = (user) => api.post('/auth/register', user);
const getMe = () => api.get('/auth/me');

export default { login, logout, register, getMe };
