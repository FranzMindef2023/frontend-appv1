import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

// Obtén la fecha y hora actual
// Obtén la fecha y hora actual y actualízala cada segundo
const getCurrentDateTime = () => {
  setInterval(() => {
    const now = new Date();
    console.log(now.toLocaleString()); // Imprime la fecha y hora actualizada cada segundo
  }, 1000);
};

export const CardsData = [
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "Total Personal",
    value: "$53k",
  },
  {
    color: "gray",
    icon: UsersIcon,
    title: "Total Novedades",
    value: "2,300",

  },
  // {
  //   color: "gray",
  //   icon: UserPlusIcon,
  //   title: "Fecha y Hora",
  //   value: getCurrentDateTime(), // Aquí se usa la fecha y hora actual
  // },
  // {
  //   color: "gray",
  //   icon: ChartBarIcon,
  //   title: "Hora Maxima",
  //   value: "$103,430",
  // },
];

export default CardsData;
