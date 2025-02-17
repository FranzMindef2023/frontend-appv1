import React,{useState, useEffect } from "react";

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
  Tooltip
} from "@nextui-org/react";

import {
  Card,
  CardHeader,
  CardBody,
  Typography,

} from "@material-tailwind/react";
import { usePersonas } from "@/context/PersonasContext";
import {PlusIcon} from "@/pages/componentes/PlusIcon";
import {SearchIcon} from "@/pages/componentes/SearchIcon";
import {ChevronDownIcon} from "@/pages/componentes/ChevronDownIcon";
import {columns, statusOptions} from "@/data/dataPersonal";
import {capitalize} from "@/data/utils";
import CustomModal from '@/pages/componentes/modals/modalsPersonal';
import {EditIcon} from "@/pages/componentes/modals/acctions/EditIcon";
import CustomModalDest from '@/pages/componentes/modals/modalDestino';
import {CustomIcon} from "@/pages/componentes/modals/acctions/CustomIcon";





const statusColorMap = {
  Activo: "success",
  Inactivo: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "celular","ci", "gsanguineo","sexo","fuerza", "actions"];

export function Personal() {
  const { users, isInitializedPer, fetchPersonas, loadingPer, getshowAssignments } = usePersonas();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenP, setModalOpenP] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assing, setAssing] = useState(null);
  useEffect(() => {
    if (!isInitializedPer) {
      fetchPersonas();
        console.log('desde el componete roles');
        console.log(users);
    }
}, [isInitializedPer]);
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
        const assing = await getshowAssignments(datauser); // Espera los datos de asignaciones
    
        setAssing(assing);
        setSelectedUser(datauser);
        // console.log(roles); // Aquí tendrás la lista de roles asignados y no asignados
        setModalOpenP(true); // Abrir el modal después de obtener los datos
    } catch (error) {
        console.error("Error fetching roles:", error);
    }
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
        Object.values(user).some((value) =>
          value && value.toString().toLowerCase().includes(filterValue.toLowerCase())
        )
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
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            {/* <Button isIconOnly color="warning" content="Editar" size="sm" aria-label="Like">
              <span onClick={() => openModal("edit", user)} className="text-lg  cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Button> */}
            <Tooltip content="Editar Datos" color="warning" size="lg">
              <span
                onClick={() => openModal("edit", user)}
                className="text-lg text-warning cursor-pointer active:opacity-50"
              >
                <EditIcon className="h-6 w-6 text-orange-500" /> {/* Ajusta el tamaño y el color */}
              </span>
            </Tooltip>
            <Tooltip content="Repartición" color="primary" size="lg">
              <span
                onClick={() => openModalP("edit", user)}
                className="text-lg text-blue cursor-pointer active:opacity-50"
              >
                <CustomIcon className="h-6 w-6 text-green-500" /> {/* Ajusta el tamaño y el color */}
              </span>
            </Tooltip>
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
              Nuevo Persona
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {users.length} Personas</span>
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
            Personal Militar
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
            title={selectedUser ? "EDITAR DATOS PERSONALES" : "REGISTRO DE NUEVO PERSONAL MILITAR"} // Cambiar el título dinámicamente
            actionLabel={selectedUser ? "ACTUALIZAR" : "REGISTRAR"}
            closeLabel="CANCELAR"
            initialData={selectedUser} // Pasar los datos iniciales
          />
          <CustomModalDest
            isOpen={isModalOpenP}
            onClose={closeModalP}
            title="ASIGNACIÓN DE REPARTATICIÓN"
            bodyContent={[
              "This is the first paragraph.",
              "This is the second paragraph.",
              "This is the third paragraph."
            ]}
            onAction={handleActionP}
            initialData={selectedUser} // Pasar los datos iniciales 
            initialAssing={assing} // Pasar los datos iniciales 
            actionLabel="REGISTRAR"
            closeLabel="CANCELAR"
          />
        </CardBody>
      </Card>
    </div>
  );
}

export default Personal;
