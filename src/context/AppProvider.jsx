import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { UsersProvider } from '@/context/UserContext';
import { AxiosProvider } from '@/context/AxiosContext';
import { RolesProvider } from '@/context/RolesContext';

import { CargosProvider } from '@/context/GargosContext';
import { OrganigramaProvider } from '@/context/OrganigramaContext';


import { SelectsProvider } from '@/context/SelectsContext';
import { PersonasProvider } from '@/context/PersonasContext';
import { NovedadesProvider } from '@/context/NovedadesContext';

const AppProvider = ({ children }) => (
  <AxiosProvider>
    <AuthProvider>
      <UsersProvider>
        <RolesProvider>
          <CargosProvider>
            <OrganigramaProvider>
              <SelectsProvider>
                <PersonasProvider>
                  <NovedadesProvider>
                    {children}
                  </NovedadesProvider>
                </PersonasProvider>
              </SelectsProvider>
            </OrganigramaProvider>
          </CargosProvider>
        </RolesProvider>
      </UsersProvider>
    </AuthProvider>
  </AxiosProvider>
);

export default AppProvider;
