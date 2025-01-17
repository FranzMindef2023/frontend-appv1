
  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "FECHA ENVIO", uid: "fechaparte", sortable: true },
    { name: "EFECTIVO", uid: "efectivo", sortable: true },
    { name: "FORMAN", uid: "total_forma", sortable: true },
    { name: "NO FORMAN", uid: "total_no_forma", sortable: true },
    { name: "TOTAL", uid: "total", sortable: true },
    { name: "ESTADO", uid: "name", sortable: true },
    { name: "ACCIONES", uid: "actions" },
  ];
  const statusOptions = [
    {name: "Activo", uid: "Activo"},
    {name: "Inactivo", uid: "Inactivo"},
  ];
  
  
  export  {columns, statusOptions};