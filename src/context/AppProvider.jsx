import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { UsersProvider } from '@/context/UserContext';
import { AxiosProvider } from '@/context/AxiosContext';
import { RolesProvider } from '@/context/RolesContext';

import { CargosProvider } from '@/context/GargosContext';
import { OrganigramaProvider } from '@/context/OrganigramaContext';

const AppProvider = ({ children }) => (
  <AxiosProvider>
    <AuthProvider>
      <UsersProvider>
        <RolesProvider>
          <CargosProvider>
            <OrganigramaProvider>
              {children}
            </OrganigramaProvider>
          </CargosProvider>
        </RolesProvider>
      </UsersProvider>
    </AuthProvider>
  </AxiosProvider>
);

export default AppProvider;
