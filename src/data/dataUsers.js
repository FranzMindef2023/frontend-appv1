
  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "ROL", uid: "name", sortable: true },
    { name: "EMAIL", uid: "email", sortable: true },
    { name: "CELULAR", uid: "celular", sortable: true },
    { name: "LOGIN", uid: "lastlogin", sortable: true },
    { name: "ESTADO", uid: "status", sortable: true },
    { name: "CREADO", uid: "fcreate", sortable: true },
    { name: "ACTUALIZADO", uid: "fupdate", sortable: true },
    { name: "ACCIONES", uid: "actions" },
  ];
  const statusOptions = [
    {name: "Activo", uid: "Activo"},
    {name: "Inactivo", uid: "Inactivo"},
  ];
  
  
  export  {columns, statusOptions};