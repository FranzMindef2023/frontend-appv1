import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { AxiosProvider } from '@/context/AxiosContext';

const AppProvider = ({ children }) => (
  <AxiosProvider>
    <AuthProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </AuthProvider>
  </AxiosProvider>
);

export default AppProvider;
