// src/services/userService.js
import api from '@/api/axios';
import axios from 'axios';

// Función para obtener todos los datos simultáneamente
const getAllData = () => {
  return axios.all([
    api.get('/situaciones'),
    api.get('/organizacion'),
    api.get('/grados'),
    api.get('/sexos'),
    api.get('/fuerzas'),
    api.get('/expediciones'),
    api.get('/estadocv'),
    api.get('/especialidades'),
    api.get('/armas'),
  ])
  .then(axios.spread((
    situaciones,
    organizacion,
    grados,
    sexos,
    fuerzas,
    expediciones,
    estadocv,
    especialidades,
    armas
  ) => {
    // Devolver los datos organizados en un objeto
    return {
      situaciones: situaciones.data,
      organizacion: organizacion.data,
      grados: grados.data,
      sexos: sexos.data,
      fuerzas: fuerzas.data,
      expediciones: expediciones.data,
      estadocv: estadocv.data,
      especialidades: especialidades.data,
      armas:armas.data
    };
  }))
  .catch(error => {
    console.error('Error al obtener datos:', error);
    throw error;
  });
};

export default {
  getAllData,
};

