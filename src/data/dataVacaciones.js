
  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "GRADO NOMBRES Y APELLIDOS", uid: "name", sortable: true },
    { name: "CELULAR", uid: "celular", sortable: true },
    { name: "NRO CI", uid: "ci", sortable: true },
    { name: "INCORPORACIÓN", uid: "fechaegreso", sortable: true },
    { name: "AÑOS DE SERVICIO", uid: "anios", sortable: true },
    { name: "DIAS", uid: "dias", sortable: true },
    { name: "DIAS DE VACACIÓN", uid: "dias_vacaciones", sortable: true },
    { name: "GESTION", uid: "gestion_actual", sortable: true },
    { name: "FUERZA", uid: "fuerza", sortable: true },
  ];
  const statusOptions = [
    {name: "EJERCITO", uid: "EJERCITO DE BOLIVIA"},
    {name: "AEREA", uid: "FUERZA AEREA"},
    {name: "ARMADA", uid: "ARMADA BOLIVIANA"},
  ];
  
  
  export  {columns, statusOptions};