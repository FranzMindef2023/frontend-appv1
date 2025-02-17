import React,{useState, useEffect } from "react";
import Swal from 'sweetalert2';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Tooltip,
  Switch,
} from "@nextui-org/react";

import {
  Card,
  CardHeader,
  CardBody,
  Typography,

} from "@material-tailwind/react";
import { useUsers } from "@/context/UserContext";
import {PlusIcon} from "@/pages/componentes/PlusIcon";
import {SearchIcon} from "@/pages/componentes/SearchIcon";
import {ChevronDownIcon} from "@/pages/componentes/ChevronDownIcon";
import {columns, statusOptions} from "@/data/dataUsers";
import {capitalize} from "@/data/utils";
import CustomModal from '@/pages/componentes/modals/modalsUsuario';
import {EditIcon} from "@/pages/componentes/modals/acctions/EditIcon";
import {KeyIcon} from "@/pages/componentes/modals/acctions/KeyIcon";

import CustomModalPrivilegios from '@/pages/componentes/modals/modalPrivilegios';




const statusColorMap = {
  Activo: "success",
  Inactivo: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "celular","puesto", "sigla","lastlogin", "situacion","estado", "actions"];

export function Profile() {
  const { users, 
    isInitialized, 
    fetchUsers, 
    asignaciones, 
    updateUserStatus} = useUsers();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenP, setModalOpenP] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRols, setSelectedRols] = useState(null);
  useEffect(() => {
    if (!isInitialized) {
      fetchUsers();
        console.log('desde el componete roles');
        console.log(users);
    }
}, [isInitialized]);
  const openModal = (accion, user = null) => {
    
    setSelectedUser(user); // Establecer los datos del usuario seleccionado
    setModalOpen(true); // Abrir el modal
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };

  const openModalP = async (accion, datauser = null) => {
      try {
        // console.log(datauser);
          const roles = await asignaciones(datauser); // Espera los datos de asignaciones
          setSelectedRols(roles);
          setSelectedUser(datauser);
          // console.log(roles); // Aquí tendrás la lista de roles asignados y no asignados
          setModalOpenP(true); // Abrir el modal después de obtener los datos
      } catch (error) {
          console.error("Error fetching roles:", error);
      }
  };
  const handlestatus = async(e,user) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estás a punto de cambiar el estado a Activo/Inactivo. Si no estás seguro, puedes cancelar esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        try {

          // Llamar a la función createUser del contexto
          updateUserStatus(!e.target.checked,user);
          // resetForm();
          // onClose();
        } catch (error) {
          console.error('Error al registrar usuario:', error);
          // alert('Error al registrar usuario');
        }
        // Swal.fire({
        //   title: "¡Actualizado!",
        //   text: "El estado se ha actualizado correctamente.",
        //   icon: "success"
        // });
      } else {
        // // Opcional: Mensaje cuando el usuario cancela
        // Swal.fire({
        //   title: "Cancelado",
        //   text: "La acción ha sido cancelada.",
        //   icon: "info"
        // });
      }
    });
    
    
  };
  const closeModalP = () => {
    setModalOpenP(false);
  };
  const handleActionP = () => {
    alert("Action executed!");
    closeModalP(); // Cierra el modal después de la acción
  };
  const handleAction = () => {
    alert("Action executed!");
    closeModal(); // Cierra el modal después de la acción
  };
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(users.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{radius: "full", size: "sm", src: user.avatar}}
            classNames={{
              description: "text-default-500",
            }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-500">{user.team}</p>
          </div>
        );
      case "estado":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[user.estado]}
            size="sm"
            variant="dot"
          >
            {cellValue}
          </Chip>
        );
        case "situacion":
        return (
          <Tooltip color="danger" content={user.status === true ? "Inactivar" : "Activar"}>
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <Switch
                size="sm"
                color="success"
                isSelected={user.status === true} // Encender si el status es Activo
                onChange={(e) => handlestatus(e, user)} // Pasar el evento y el usuario
              ></Switch>
              </span>
            </Tooltip>
          
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Tooltip content="Editar Usuario" color="warning" size="lg">
              <span
                onClick={() => openModal("edit", user)}
                className="text-lg text-warning cursor-pointer active:opacity-50"
              >
                <EditIcon className="h-6 w-6 text-orange-500" /> {/* Ajusta el tamaño y el color */}
              </span>
            </Tooltip>
            {/* <Tooltip color="danger" content="Eliminar" size="lg">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip> */}
            <Tooltip content="Rol de Usuario" color="primary" size="lg">
              <span onClick={() => openModalP("edit", user)} className="text-lg  cursor-pointer active:opacity-50">
                <KeyIcon className="h-6 w-6 text-blue-500" />
                </span>
            </Tooltip>
            {/* <Button isIconOnly color="primary" size="sm" aria-label="Like">
              <span onClick={() => openModalP("edit", user)} className="text-lg  cursor-pointer active:opacity-50">
              <LockOpenIcon className="h-6 w-6 text-gray-500" />
              </span>
              
            </Button> */}
            {/* <Button content="Editar" size="sm">
              <span onClick={() => openModal("edit", user)} className="text-lg text-warning cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Button> */}
            {/* <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);


  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Estados
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              className="bg-foreground text-background"
              endContent={<PlusIcon />}
              size="sm"
              onPress={() => openModal("create")}
            >
              Nuevo usuario
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {users.length} Usuarios</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} de ${items.length} Seleccionados`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [],
  );
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Perfil de Usuarios
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4 overflow-x-scroll"> {/* Quité overflow-x-auto */}
          <Table
            isCompact
            removeWrapper
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            className="w-full table-auto" // Ajustado para que ocupe todo el ancho disponible sin overflow
            checkboxesProps={{
              classNames: {
                wrapper: "after:bg-foreground after:text-background text-background",
              },
            }}
            classNames={classNames}
            selectedKeys={selectedKeys}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"No users found"} items={sortedItems}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <CustomModal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={selectedUser ? "EDITAR USUARIO" : "REGISTRO DE NUEVO USUARIO"} // Cambiar el título dinámicamente
            actionLabel={selectedUser ? "ACTUALIZAR" : "REGISTRAR"}
            closeLabel="CANCELAR"
            initialData={selectedUser} // Pasar los datos iniciales
          />
          <CustomModalPrivilegios
              isOpen={isModalOpenP}
              onClose={closeModalP}
              title="ROL DE USUARIO"
              bodyContent={[
                "This is the first paragraph.",
                "This is the second paragraph.",
                "This is the third paragraph."
              ]}
              onAction={handleActionP}
              initialData={selectedRols} // Pasar los datos iniciales
              initialDataUser={selectedUser}
              actionLabel="REGISTRAR"
              closeLabel="CANCELAR"
            />
        </CardBody>
      </Card>
    </div>
  );
}

export default Profile;
