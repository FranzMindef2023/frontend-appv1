
  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "GRADO NOMBRES Y APELLIDOS", uid: "name", sortable: true },
    { name: "EMAIL", uid: "email", sortable: true },
    { name: "CELULAR", uid: "celular", sortable: true },
    { name: "NRO CI", uid: "ci", sortable: true },
    { name: "NACIMIENTO", uid: "fechnacimeinto", sortable: true },
    { name: "SANGRE", uid: "gsanguineo", sortable: true },
    { name: "FUERZA", uid: "fuerza", sortable: true },
    { name: "GENERO", uid: "sexo", sortable: true },  
    { name: "REPARTICIÓN", uid: "organizacion", sortable: true },
    { name: "CARGO", uid: "puesto", sortable: true },
    { name: "EDAD", uid: "edad", sortable: true },
    { name: "ESTADO CIVIL", uid: "status_civil", sortable: true },
    { name: "REGISTRO", uid: "created_at", sortable: true },
    { name: "ACCIONES", uid: "actions" },
  ];
  const statusOptions = [
    {name: "Activo", uid: "Activo"},
    {name: "Inactivo", uid: "Inactivo"},
  ];
  
  
  export  {columns, statusOptions};