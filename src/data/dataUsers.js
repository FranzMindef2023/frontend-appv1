
  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "GRADO NOMBRES Y APELLIDOS", uid: "name", sortable: true },
    { name: "EMAIL", uid: "email", sortable: true },
    { name: "CELULAR", uid: "celular", sortable: true },
    { name: "LOGIN", uid: "lastlogin", sortable: true },
    { name: "ESTADO", uid: "estado", sortable: true },
    { name: "CARGO", uid: "puesto", sortable: true },
    { name: "SITUACIÓN", uid: "situacion" },
    { name: "UNIDAD ORG.", uid: "organizacion", sortable: true },
    { name: "SIGLA", uid: "sigla", sortable: true },
    { name: "CREADO", uid: "fcreate", sortable: true },
    { name: "ACTUALIZADO", uid: "fupdate", sortable: true },
    { name: "ACCIONES", uid: "actions" },
  ];
  const statusOptions = [
    {name: "Activo", uid: "Activo"},
    {name: "Inactivo", uid: "Inactivo"},
  ];
  
  
  export  {columns, statusOptions};