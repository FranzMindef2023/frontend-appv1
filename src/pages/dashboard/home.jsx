import React,{useEffect, useState} from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Progress,
} from "@material-tailwind/react";
import { BanknotesIcon, UserPlusIcon, UsersIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import {
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { useHomes } from "@/context/HomeContext";

export function Home() {
  const { users, 
    isInitialized, 
    fetchUsuarios,
    fetchUsuariosCount,
    isInitialcount,
    userscount,
    fetchPersonalCount,
    isInitialPersonal,
    personascount,
    fetchNovedadesCount,
    isInitialNovedades,
    novedadescount,
    countpartepersona,
    isInitialParte,
    partescount
    } = useHomes();
    const [statisticsCardsData, setArrayCajas] = useState([]);
    //cargar los datos 
    useEffect(() => {
    if (!isInitialized) {
        fetchUsuarios();
    }
    if (!isInitialcount) {
        fetchUsuariosCount();
    }
    if (!isInitialPersonal) {
        fetchPersonalCount();
    }
    if (!isInitialNovedades) {
        fetchNovedadesCount();
    }
    if (!isInitialParte) {
        countpartepersona();
    }
    const statisticsCardsData = [
        {
          color: "gray",
          icon: BanknotesIcon,
          title: "USUARIOS DEL SISTEMA",
          value: userscount,
          footer: {
            color: "text-green-500",
            label: "Total de Usuariod Activos",
          },
        },
        {
          color: "gray",
          icon: UsersIcon,
          title: "PERSONAL MILITAR",
          value: personascount,
          footer: {
            color: "text-green-500",
            label: "Total de Personas Mindef",
          },
        },
        {
          color: "gray",
          icon: UserPlusIcon,
          title: "PERMISOS SOLICITADOS",
          value: novedadescount,
          footer: {
            color: "text-red-500",
            label: "Total de Permisos Solicitados",
          },
        },
        {
          color: "gray",
          icon: ChartBarIcon,
          title: "EFECTIVO TOTAL",
          value: partescount,
          footer: {
            color: "text-green-500",
            label: "Efectivo Total del Parte",
          },
        },
      ];
      setArrayCajas(statisticsCardsData);
    }, [isInitialized,
    isInitialcount,
    isInitialPersonal,
    isInitialNovedades,
    isInitialParte]);

  useEffect(() => {
    if (!isInitialized) {
      fetchUsuarios();
    }
    if (!isInitialcount) {
      fetchUsuariosCount();
    }
    if (!isInitialPersonal) {
      fetchPersonalCount();
    }
    if (!isInitialNovedades) {
      fetchNovedadesCount();
    }
  }, [isInitialized,isInitialcount,isInitialPersonal,isInitialNovedades]);
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                USUARIOS DEL SISTEMA
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>Envio del Parte</strong>
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Actualizar</MenuItem>
                {/* <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem> */}
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["nombres", "repartición", "celular","personal", "enviado"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map(
                  ({ completo, name, nomorg, celular,personas_control, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === users.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            {/* <Avatar src={completo} alt={name} size="sm" /> */}
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {completo}
                            </Typography>
                          </div>
                        </td>
                        {/* <td className={className}>
                          {members.map(({ completo, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={completo}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </td> */}
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {nomorg}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {celular}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {personas_control}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              variant="gradient"
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
