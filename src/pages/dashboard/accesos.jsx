import React, { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  User,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Switch,
  Alert
} from "@nextui-org/react";

import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";

import { PlusIcon } from "@/pages/componentes/PlusIcon";

import { useOrganigrama } from "@/context/OrganigramaContext";
import { useUsers } from "@/context/UserContext";
import {CustomIcon} from "@/pages/componentes/modals/acctions/CustomIcon";

const statusColorMap = {
  Activo: "success",
  Inactivo: "danger",
  Vacation: "warning",
};

// Colores para cada nivel de profundidad
const levelColors = ["#e3f2fd", "#f1f8e9", "#fff8e1", "#ffebee"];

export function Accesos() {
  const [expandedNodes, setExpandedNodes] = useState(new Set()); // Conjunto para nodos expandidos
  const { fetchOrgPhat, organPhat, fetchOrgAccess, organAccess, isInitialized } = useOrganigrama();
  const { usersAccess, fetchUsersAccess, isInitialUser, createAcceso, deleteAcceso} = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const notify = () => toast('Here is your toast.');

  useEffect(() => {
    if (!isInitialized) fetchOrgPhat();
    if (!isInitialUser) fetchUsersAccess();
  }, [isInitialized, isInitialUser]);

  const toggleExpansion = async (nodeId) => {
    if (!nodeId) {
      alert("El nodo es inválido.");
      return;
    }
  
    if (!selectedUser) {
      // Mostrar alerta si el usuario no está seleccionado
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000); // Ocultar después de 3 segundos
      return;
    }
  
    try {
      const newExpandedNodes = new Set(expandedNodes);
  
      if (newExpandedNodes.has(nodeId)) {
        // Si el nodo ya está expandido, colapsarlo y eliminar sus hijos
        collapseDescendants(nodeId, newExpandedNodes);
      } else {
        // Si el nodo no está expandido, cargar y expandir
        if (!organAccess[nodeId]) {
          await fetchOrgAccess(selectedUser, nodeId);
        }
        newExpandedNodes.add(nodeId);
      }
  
      setExpandedNodes(newExpandedNodes);
    } catch (error) {
      console.error("Error al cargar nodos hijos:", error);
    }
  };
  
  const collapseDescendants = (nodeId, expandedSet) => {
    expandedSet.delete(nodeId); // Eliminar el nodo actual
  
    const descendants = getDescendants(nodeId); // Obtener hijos del nodo
    descendants.forEach((descendant) => {
      collapseDescendants(descendant.idorgani, expandedSet); // Llamada recursiva
    });
  };
  
  const getDescendants = (nodeId) => {
    return organAccess[nodeId] || []; // Retorna hijos inmediatos o un arreglo vacío
  };
  
  const renderRow = (node, level) => {
    const descendants = getDescendants(node.idorgani);
    const rowColor = levelColors[level % levelColors.length] || "#ffffff";
    const handleStatusChange = async (e) => {
      try {
        await handlestatus(e, node.idorgani, node.idpadre);
        // console.log();
        // Actualizar el estado local del nodo asignado
        node.assigned = !e.target.checked ? 1 : 0; // Cambiar dinámicamente el valor
      } catch (error) {
        console.error("Error al cambiar el estado:", error);
      }
    };
    return (
      <React.Fragment key={node.idorgani}>
        <TableRow
          style={{
            backgroundColor: rowColor,
          }}
        >
          <TableCell>
          <CustomIcon className="h-6 w-6 text-green-500" />
          {node.nomorg}
            {/* <User
              name={node.nomorg}
              description={`Nivel ${level}`}
              avatar={node.avatar || "https://i.pravatar.cc/300"}
            /> */}
          </TableCell>
          <TableCell>{node.sigla}</TableCell>
          <TableCell>{node.idorgani}</TableCell>
          <TableCell>{node.idpadre}</TableCell>
          <TableCell>
            <Chip color={statusColorMap["Activo"]} size="sm">
              Activo
            </Chip>
          </TableCell>
          <TableCell> 
            <Switch
              defaultSelected={node.assigned === 1}
              isSelected={node.assigned === 1}
              color="success"
              onChange={handleStatusChange}
            >
              {node.assigned === 1 ? "Activo" : "Inactivo"}
            </Switch>
          </TableCell>
          <TableCell>
            <Button
              auto
              light
              icon={<PlusIcon />}
              onClick={() => toggleExpansion(node.idorgani)}
              aria-label="Expandir"
            >
              {expandedNodes.has(node.idorgani) ? "Ocultar Hijos" : "Mostrar Hijos"}
            </Button>
          </TableCell>
        </TableRow>
        {expandedNodes.has(node.idorgani) &&
          descendants.map((child) => renderRow(child, level + 1))}
      </React.Fragment>
    );
  };
  
  const handlestatus = async (e, node, idpadre) => {
    if (!selectedUser) {
      // Mostrar alerta si el usuario no está seleccionado
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000); // Ocultar después de 3 segundos
      return;
    }
    try {
      if (e.target.checked) {
        // Llamar a la función createAcceso del contexto
        await createAcceso(selectedUser,node);
        toast.success('Acceso permitido exitosamente.')
      } else {
        // Llamar a la función deleteAcceso del contexto
        await deleteAcceso(selectedUser, node);
        toast.error('Acceso deshabilitado correctamente.')
      }
      // node.assigned = e.target.checked ? 1 : 0;
      // Ejecutar fetchOrgAccess para actualizar el estado
      // await fetchOrgAccess(selectedUser, idpadre);

      // Mostrar alerta de éxito
      // Swal.fire({
      //   title: "¡Actualizado!",
      //   text: "El estado se ha actualizado correctamente.",
      //   icon: "success"
      // });
    } catch (error) {
      console.error("Error al actualizar el estado:", error);

      // Mostrar alerta de error
      // Swal.fire({
      //   title: "Error",
      //   text: "Ocurrió un error al actualizar el estado. Intenta nuevamente.",
      //   icon: "error"
      // });
    }
    // Swal.fire({
    //   title: "¿Estás seguro?",
    //   text: "Estás a punto de ejecutar el proceso. Si no estás seguro, puedes cancelar esta acción.",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Sí, continuar",
    //   cancelButtonText: "Cancelar"
    // }).then(async (result) => {
    //   if (result.isConfirmed) {
    //     try {
    //       if (!e.target.checked) {
    //         // Llamar a la función createAcceso del contexto
    //         await createAcceso(selectedUser,node);
    //       } else {
    //         // Llamar a la función deleteAcceso del contexto
    //         await deleteAcceso(selectedUser, node);
    //       }
    //       // node.assigned = e.target.checked ? 1 : 0;
    //       // Ejecutar fetchOrgAccess para actualizar el estado
    //       // await fetchOrgAccess(selectedUser, idpadre);
  
    //       // Mostrar alerta de éxito
    //       Swal.fire({
    //         title: "¡Actualizado!",
    //         text: "El estado se ha actualizado correctamente.",
    //         icon: "success"
    //       });
    //     } catch (error) {
    //       console.error("Error al actualizar el estado:", error);
  
    //       // Mostrar alerta de error
    //       Swal.fire({
    //         title: "Error",
    //         text: "Ocurrió un error al actualizar el estado. Intenta nuevamente.",
    //         icon: "error"
    //       });
    //     }
    //   } else {
    //     // Mostrar alerta opcional para acción cancelada
    //     Swal.fire({
    //       title: "Cancelado",
    //       text: "La acción ha sido cancelada.",
    //       icon: "info"
    //     });
    //   }
    // });
  };
  

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Accesos de Usuarios
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4 overflow-x-scroll">
          {/* Autocomplete para seleccionar usuario */}
          {alertVisible && (
            <Alert color="warning" title="Por favor selecciona un usuario antes de continuar." />
          )}
          <Toaster 
          position="top-right"
          />
          <Autocomplete
            size="sm"
            isRequired
            label="Selecciona el usuario"
            variant="bordered"
            onSelectionChange={async (key) => {
              // Actualizar el usuario seleccionado
              setSelectedUser(key);
          
              // Restablecer el estado de los nodos expandidos
              setExpandedNodes(new Set());
          
              // Verificar y cargar accesos para el nuevo usuario
              if (key) {
                try {
                  await fetchOrgAccess(key, null); // Carga inicial de accesos para el usuario
                } catch (error) {
                  console.error("Error al cargar los accesos del usuario:", error);
                }
              }
            }}
          >
            {usersAccess.map((user) => (
              <AutocompleteItem
                key={user.iduser}
                // startContent={<Avatar alt={user.name} className="w-6 h-6" src={user.avatar || "https://i.pravatar.cc/300"} />}
              >
                {user.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          {/* Tabla principal */}
          <Table aria-label="Example access management table" className="min-w-full">
            <TableHeader>
              <TableColumn>REPARTICION</TableColumn>
              <TableColumn>SIGLA</TableColumn>
              <TableColumn>CODIGO</TableColumn>
              <TableColumn>PADRE</TableColumn>
              <TableColumn>Estado</TableColumn>
              <TableColumn>Acceso</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody>
              {/* Renderizar nodos principales */}
              {organPhat.map((org) => renderRow(org, 0))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Accesos;
