import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { UsersProvider } from '@/context/UserContext';
import { AxiosProvider } from '@/context/AxiosContext';
import { RolesProvider } from '@/context/RolesContext';

const AppProvider = ({ children }) => (
  <AxiosProvider>
    <AuthProvider>
      <UsersProvider>
        <RolesProvider>
          {children}
        </RolesProvider>
      </UsersProvider>
    </AuthProvider>
  </AxiosProvider>
);

export default AppProvider;
