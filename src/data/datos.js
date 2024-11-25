const columns = [
  { name: "ID", uid: "idrol", sortable: true },
  { name: "NAME", uid: "rol", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];

export { columns, statusOptions };
