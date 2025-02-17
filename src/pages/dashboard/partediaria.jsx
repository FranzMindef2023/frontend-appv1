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
  Chip,
  User,
  Pagination,
  Alert
} from "@nextui-org/react";

import {
  Card,
  CardHeader,
  CardBody,
  Typography,

} from "@material-tailwind/react";
import Loader from "../../component/Loader/Loader";
import { useNovedades } from "@/context/NovedadesContext";

import {SearchIcon} from "@/pages/componentes/SearchIcon";

import {columns, statusOptions} from "@/data/dataPartes";

import {EditIcon} from "@/pages/componentes/modals/acctions/EditIcon";
import {EyeIcon} from "@/pages/componentes/modals/acctions/EyeIcon";

import { StatisticsCard } from "@/widgets/cards";
// import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import {
  CardsData,
} from "@/data";




const statusColorMap = {
  Activo: "success",
  Inactivo: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "celular","fuerza","puesto","organizacion","estado_forma"];

export function Partediaria() {
  const {  isInitNovedades, fetchPerNovedades,storeMassive} = useNovedades();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [alertVisible, setAlertVisible] = useState(false);
  const [isLoa, setIsLoa] = useState(false); 
  const [isModalOpenP, setModalOpenP] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [novedades, setNovedades] = useState([]);
  const [assing, setAssing] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateTime, setDateTime] = useState(new Date());
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "age",
    direction: "ascending",
  });
  const getRelacionNominal=async ()=>{
    setIsLoading(true); // Activa el loader
    const usePersonas= await fetchPerNovedades();
    // console.log(usePersonas);
    setNovedades(usePersonas);
    setIsLoading(false); // Desactiva el loader
  }
  useEffect(() => {
    console.log("Claves seleccionadas (updated):", Array.from(selectedKeys));
  }, [selectedKeys]);
  const enviarParte = async (event) => {
    setIsLoa(true);
    // Evita el comportamiento predeterminado del botón o formulario
    event.preventDefault();
  
    // console.log("Botón clickeado, función enviarParte ejecutada",selectedKeys);
  
    const isAllSelected = selectedKeys === "all";
    // console.log("isAllSelected:", isAllSelected);
  
    const selectedKeysArray = isAllSelected
      ? novedades.map((user) => String(user.id))
      : Array.from(selectedKeys);
  
    if (selectedKeysArray.length === 0) {
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000); // Ocultar después de 3 segundos
      setIsLoa(false);
      return;
    }
  
    const selectedData = novedades.filter((user) =>
      selectedKeysArray.includes(String(user.id))
    );
    await storeMassive(selectedData);
    console.log("Usuarios seleccionados para enviar:", selectedData);
    setIsLoa(false);
  };
  
  
  
  useEffect(() => {
    console.log("selectedKeys actualizado:", Array.from(selectedKeys));
     // Crear un intervalo que actualice la hora cada segundo
     const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(timer);
  }, [selectedKeys]);
  
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(novedades.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...novedades];

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
  }, [novedades, filterValue, statusFilter]);

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
            {/* <Dropdown>
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
            </Dropdown> */}
           
            
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {novedades.length} Usuarios</span>
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
    novedades.length,
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
            ? `${novedades.length} usuarios seleccionados`
            : `${selectedKeys.size} de ${items.length} seleccionados`}
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
          <Typography variant="h6" color="white" className="flex justify-between items-center">
            Generacion del Parte diaria
            <span className="ml-auto text-right">
              {/* <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-400" /> */}
              <strong>{dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}</strong>
              
            </span>
          </Typography>
        </CardHeader>

        <CardBody className="flex flex-col gap-4 p-4 overflow-x-scroll"> {/* Quité overflow-x-auto */}
        {alertVisible && (
          <Alert 
            color="danger" 
            title="Seleccione todo el personal de su repartición para generar el parte diario." 
          />
        )}
        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            {CardsData.map(({ icon, title, ...rest }) => (
              <StatisticsCard
                key={title}
                {...rest}
                title={title}
                icon={React.createElement(icon, {
                  className: "w-6 h-6 text-white",
                })}
              />
            ))}
        </div>
          <div className="mb-12 flex justify-end gap-4">
          {isLoading && <Loader aria-live="polite" />}
          <Button 
            onClick={() => !isLoading && getRelacionNominal()}  
            className={`bg-foreground text-background ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            Relacion Nominal
          </Button>
          {isLoa && <Loader aria-live="polite" />}
            <Button 
            type="button" 
            onClick={enviarParte} 
            color="warning"
            disabled={isLoa}
            aria-busy={isLoa}
            >
              Enviar Parte
            </Button>
          </div>
            <hr />
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
            selectionMode="multiple"
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
          
        </CardBody>
      </Card>
    </div>
  );
}

export default Partediaria;
