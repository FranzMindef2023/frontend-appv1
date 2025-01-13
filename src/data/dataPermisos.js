
  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "GRADO NOMBRES Y APELLIDOS", uid: "name", sortable: true },
    { name: "CELULAR", uid: "celular", sortable: true },
    { name: "NRO CI", uid: "ci", sortable: true },
    { name: "NACIMIENTO", uid: "fechnacimeinto", sortable: true },
    { name: "FUERZA", uid: "fuerza", sortable: true },
    { name: "PERMISO", uid: "tipo_novedad", sortable: true },
    { name: "DESDE", uid: "inicio", sortable: true },
    { name: "HASTA", uid: "fin", sortable: true },
    { name: "DESCRIPCION", uid: "descripcion", sortable: true },
    { name: "ACCIONES", uid: "actions" },
  ];
  const statusOptions = [
    {name: "Activo", uid: "Activo"},
    {name: "Inactivo", uid: "Inactivo"},
  ];
  
  
  export  {columns, statusOptions};