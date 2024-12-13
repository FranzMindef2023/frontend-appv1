import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { UsersProvider } from '@/context/UserContext';
import { AxiosProvider } from '@/context/AxiosContext';
import { RolesProvider } from '@/context/RolesContext';

import { CargosProvider } from '@/context/GargosContext';
import { OrganigramaProvider } from '@/context/OrganigramaContext';

import { ArmasProvider } from '@/context/ArmasContext';
import { EspecialidadProvider } from '@/context/EspecialidadContext';
import { StatuscvProvider } from '@/context/EstadocvContext';
import { FuerzasProvider } from '@/context/FuerzasContext';
import { GenerosProvider } from '@/context/GenerosContext';
import { GradosProvider } from '@/context/GradosContext';
import { SituacionesProvider } from '@/context/SituacionesContext';
import { ExpedidosProvider } from '@/context/ExpedicionesContext';
import { SelectsProvider } from '@/context/SelectsContext';

const AppProvider = ({ children }) => (
  <AxiosProvider>
    <AuthProvider>
      <UsersProvider>
        <RolesProvider>
          <CargosProvider>
            <OrganigramaProvider>
              <SelectsProvider>
                {children}
              </SelectsProvider>
              {/* <ArmasProvider>
                <EspecialidadProvider>
                  <StatuscvProvider>
                    <FuerzasProvider>
                      <GenerosProvider>
                        <GradosProvider>
                          <SituacionesProvider>
                            <ExpedidosProvider>
                             {children}
                            </ExpedidosProvider>
                          </SituacionesProvider>
                        </GradosProvider>
                      </GenerosProvider>
                    </FuerzasProvider>
                  </StatuscvProvider>
                </EspecialidadProvider>
              </ArmasProvider> */}
            </OrganigramaProvider>
          </CargosProvider>
        </RolesProvider>
      </UsersProvider>
    </AuthProvider>
  </AxiosProvider>
);

export default AppProvider;
