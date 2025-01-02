import React, { useState, useEffect } from "react";
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
} from "@nextui-org/react";

import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";

import { PlusIcon } from "@/pages/componentes/PlusIcon";

import { useOrganigrama } from "@/context/OrganigramaContext";
import { useUsers } from "@/context/UserContext";

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
  const { usersAccess, fetchUsersAccess, isInitialUser } = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!isInitialized) fetchOrgPhat();
    if (!isInitialUser) fetchUsersAccess();
  }, [isInitialized, isInitialUser]);

  const toggleExpansion = async (node) => {
    if (!node) {
      alert("El nodo es inválido.");
      return;
    }

    if (!selectedUser) {
      alert("Por favor selecciona un usuario primero.");
      return;
    }

    try {
      if (!organAccess[node]) {
        await fetchOrgAccess(selectedUser, node);
      }

      const newExpandedNodes = new Set(expandedNodes);
      if (newExpandedNodes.has(node)) {
        collapseDescendants(node, newExpandedNodes);
      } else {
        newExpandedNodes.add(node);
      }
      setExpandedNodes(newExpandedNodes);
    } catch (error) {
      console.error("Error al cargar nodos hijos:", error);
    }
  };

  const collapseDescendants = (node, expandedSet) => {
    expandedSet.delete(node);

    const descendants = getDescendants(node);
    descendants.forEach((descendant) => expandedSet.delete(descendant.idorgani));
  };

  const getDescendants = (nodeId) => {
    return organAccess[nodeId] || [];
  };

  const renderRow = (node, level) => {
    const descendants = getDescendants(node.idorgani);
    const rowColor = levelColors[level % levelColors.length] || "#ffffff";

    return (
      <React.Fragment key={node.idorgani}>
        <TableRow
          style={{
            backgroundColor: rowColor,
          }}
        >
          <TableCell>
            <User
              name={node.nomorg}
              description={`Nivel ${level}`}
              avatar={node.avatar || "https://i.pravatar.cc/300"}
            />
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
          <Autocomplete
            size="sm"
            isRequired
            label="Selecciona el usuario"
            variant="bordered"
            onSelectionChange={(key) => {
              setSelectedUser(key);
            }}
          >
            {usersAccess.map((user) => (
              <AutocompleteItem
                key={user.iduser}
                startContent={<Avatar alt={user.name} className="w-6 h-6" src={user.avatar || "https://i.pravatar.cc/300"} />}
              >
                {user.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>

          {/* Tabla principal */}
          <Table aria-label="Example access management table" className="min-w-full">
            <TableHeader>
              <TableColumn>Usuario</TableColumn>
              <TableColumn>SIGLA</TableColumn>
              <TableColumn>CODIGO</TableColumn>
              <TableColumn>PADRE</TableColumn>
              <TableColumn>Estado</TableColumn>
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
