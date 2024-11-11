import React, { createContext, useContext } from 'react';
import api from '../api/axios';

const AxiosContext = createContext();

export const AxiosProvider = ({ children }) => (
  <AxiosContext.Provider value={{ api }}>
    {children}
  </AxiosContext.Provider>
);

export const useAxios = () => useContext(AxiosContext);
