import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Switch,
  Input,
  Autocomplete, 
  AutocompleteItem,
  Textarea
} from "@nextui-org/react";
import { useUsers } from "@/context/UserContext";
import { useOrganigrama } from "@/context/OrganigramaContext";
import { useCargo } from "@/context/GargosContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const CustomModalDest = ({ isOpen, onClose, title, actionLabel, closeLabel, initialData, initialDataUser}) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedItem, setSelectedItem] = useState([]);
  const { fetchOrgPhat,getOrgByIdPhat,organPhat,orgChil,isInitialized,loading,orgChilphat,getOrganigramaByHijo} = useOrganigrama();
  const { cargos,fetchCargos, isInitializedCar } = useCargo();
  const { createUserRols} = useUsers();
  useEffect(() => {
    
    if (!isInitialized) fetchOrgPhat();
    if (!isInitializedCar) fetchCargos();
  },[isInitialized,isInitializedCar]);
  const {handleSubmit,handleBlur,values,handleChange,errors,touched,resetForm,setFieldValue }= useFormik({
    initialValues:{
      gestion: '',
      startdate: '',
      status:true,
      idorg:[],
      idorgn1:[],
      idpuesto:[],
      motivo:'',
      ...initialData,
    },
    enableReinitialize: true,
    onSubmit:async (values) =>{
      // console.log(values);
      // return true;
      try {
        if (initialData?.id) {
          // Si `initialData` tiene un `id`, es edición
          await updateUser(values); // Asume que tienes esta función
        } else {
          await createUser(values);
        }
        resetForm();
        onClose();
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario');
      }
    },
    validationSchema:Yup.object({
      motivo: Yup.string().max(250,'Debe tener maximo de 250 caracteres').required('Campo requerido'),
      startdate: Yup.string()
            .matches(
              /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/, // Cambiado para soportar DD-MM-YYYY
              "El formato debe ser DD-MM-YYYY"
            )
            .test("is-valid-date", "Fecha inválida", (value) => {
              if (!value) return false;
              const [day, month, year] = value.split("-").map(Number); // Divide por '-' en lugar de '/'
              const date = new Date(year, month - 1, day);
              return (
                date.getFullYear() === year &&
                date.getMonth() === month - 1 &&
                date.getDate() === day
              );
            })
            .test("not-future-date", "La fecha no puede ser futura", (value) => {
              if (!value) return false;
              const [day, month, year] = value.split("-").map(Number);
              const date = new Date(year, month - 1, day);
              return date <= new Date(); // La fecha ingresada debe ser menor o igual a hoy
            })
            .required("La fecha de nacimiento es obligatoria"),

    })
  });
  // Configurar el rol seleccionado basado en `assigned`
  useEffect(() => {
    if (initialData?.idorg) {
      const selectedOrg = organPhat.find((item) => item.idorg === Number(initialData.idorg)); // Forzar a tipo número
      setSelectedItem(selectedOrg);
      setFieldValue('idorg', selectedOrg?.idorg || ''); // Actualiza Formik
    }
  }, [initialData]);

  const handleFilter = async (key) => {
    try {
      await getOrganigramaByHijo(key);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar usuario");
    }
  };
  const handleFilterHijos = async (key) => {
    try {
      await getOrgByIdPhat(key);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar usuario");
    }
  };
  const handleDateInput = (e, setFieldValue) => {
    let value = e.target.value.replace(/\D/g, ""); // Elimina todo lo que no sea número
    if (value.length >= 2) {
      value = value.slice(0, 2) + "-" + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }
    setFieldValue("startdate", value);
  };
  
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} size="lg">
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <form noValidate onSubmit={handleSubmit}>
          <ModalBody>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Input
                size="sm"
                isReadOnly
                type="text"
                label="NOMBRE Y APELLIDOS"
                variant="bordered"
                isInvalid={!!errors.name && touched.name}  // Mostrar error si hay error y el campo ha sido tocado
                onChange={handleChange}  // Manejar el cambio con Formik
                onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                name="name"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                value={values.name}  // El valor actual del campo en el formulario
                color={errors.name ? "danger" : "success"}  // Cambiar color según el error
                errorMessage={errors.name}  // Mostrar el mensaje de error desde Formik
                className="block w-full"
              />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Input
                size="sm"
                isReadOnly
                type="text"
                label="CEDULA DE CI"
                variant="bordered"
                isInvalid={!!errors.ci && touched.ci}  // Mostrar error si hay error y el campo ha sido tocado
                onChange={handleChange}  // Manejar el cambio con Formik
                onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                name="ci"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                value={values.ci}  // El valor actual del campo en el formulario
                color={errors.ci ? "danger" : "success"}  // Cambiar color según el error
                errorMessage={errors.ci}  // Mostrar el mensaje de error desde Formik
                className="block w-full"
              />
              <Input
                size="sm"
                isReadOnly
                type="text"
                label="FUERZA"
                variant="bordered"
                isInvalid={!!errors.fuerza && touched.fuerza}  // Mostrar error si hay error y el campo ha sido tocado
                onChange={handleChange}  // Manejar el cambio con Formik
                onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                name="fuerza"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                value={values.fuerza}  // El valor actual del campo en el formulario
                color={errors.fuerza ? "danger" : "success"}  // Cambiar color según el error
                errorMessage={errors.fuerza}  // Mostrar el mensaje de error desde Formik
                className="block w-full"
              />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
            <Autocomplete
              size="sm"
              isRequired
              label="Buscar repaticion"
              variant="bordered"
              className="block w-full"
              selectedKey={values.idorgani ? String(values.idorgani) : undefined} // Maneja valores vacíos correctamente
              onSelectionChange={(key) => {
                // console.log('key del padre');
                // console.log(key);
                if (!key) {
                  
                  setFieldValue('idorgani', ''); // Limpia el valor en Formik
                  setSelectedItem(null); // Limpia el estado local
                  return;
                }
                handleFilter(key);
                const selectedOrg = organPhat.find((item) => item.idorgani === Number(key));
                setFieldValue('idorgani', selectedOrg?.idorgani || ''); // Actualiza Formik
                setSelectedItem(selectedOrg); // Actualiza el estado local
              }}
              defaultItems={organPhat}
            >
              {(item) => <AutocompleteItem key={String(item.idorgani)}>{item.nomorg}</AutocompleteItem>}
            </Autocomplete>
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Autocomplete
                size="sm"
                isRequired
                label="Buscar unidad orgnaizacional"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idhijastro ? String(values.idhijastro) : undefined} // Maneja valores vacíos correctamente
                onSelectionChange={(key) => {
                  // console.log('key del padre');
                  // console.log(key);
                  if (!key) {
                    
                    setFieldValue('idhijastro', ''); // Limpia el valor en Formik
                    setSelectedItem(null); // Limpia el estado local
                    return;
                  }
                  handleFilterHijos(key);
                  const selectedOrg = orgChilphat.find((item) => item.idhijastro === Number(key));
                  setFieldValue('idhijastro', selectedOrg?.idhijastro || ''); // Actualiza Formik
                  setSelectedItem(selectedOrg); // Actualiza el estado local
                }}
                // defaultItems={orgChilphat}
                defaultItems={orgChilphat?.length > 0 ? orgChilphat : []}
              >
                {(item) => <AutocompleteItem key={String(item.idhijastro)}>{item.nomorg}</AutocompleteItem>}
              </Autocomplete>
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Autocomplete
                size="sm"
                isRequired
                label="Buscar unidades organizacional dependiente"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idorg ? String(values.idorg) : undefined} // Maneja valores vacíos correctamente
                onSelectionChange={(key) => {
                  // console.log('key del padre');
                  // console.log(key);
                  if (!key) {
                    
                    setFieldValue('idorg', ''); // Limpia el valor en Formik
                    setSelectedItem(null); // Limpia el estado local
                    return;
                  }
                  // handleFilterHijos(key);
                  const selectedOrg = orgChil.find((item) => item.idorg === Number(key));
                  setFieldValue('idorg', selectedOrg?.idorg || ''); // Actualiza Formik
                  setSelectedItem(selectedOrg); // Actualiza el estado local
                }}
                // defaultItems={orgChil}
                defaultItems={orgChil?.length > 0 ? orgChil : []}
              >
                {(item) => <AutocompleteItem key={String(item.idorg)}>{item.nomorg}</AutocompleteItem>}
              </Autocomplete>
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Autocomplete
                size="sm"
                isRequired
                label="Buscar cargo"
                variant="bordered"
                className="block w-full"
                selectedKey={values.idpuesto ? String(values.idpuesto) : undefined} // Maneja valores vacíos correctamente
                onSelectionChange={(key) => {
                  // console.log('key del padre');
                  // console.log(key);
                  if (!key) {
                    
                    setFieldValue('idpuesto', ''); // Limpia el valor en Formik
                    setSelectedItem(null); // Limpia el estado local
                    return;
                  }
                  // handleFilterHijos(key);
                  const selectedOrg = cargos.find((item) => item.idpuesto === Number(key));
                  setFieldValue('idpuesto', selectedOrg?.idpuesto || ''); // Actualiza Formik
                  setSelectedItem(selectedOrg); // Actualiza el estado local
                }}
                // defaultItems={cargos}
                defaultItems={cargos?.length > 0 ? cargos : []}
              >
                {(item) => <AutocompleteItem key={String(item.idpuesto)}>{item.nompuesto}</AutocompleteItem>}
              </Autocomplete>
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Input
                size="sm"
                isRequired={true}
                type="text"
                label="GESTION"
                variant="bordered"
                isInvalid={!!errors.gestion && touched.gestion}  // Mostrar error si hay error y el campo ha sido tocado
                onChange={handleChange}  // Manejar el cambio con Formik
                onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                name="gestion"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                value={values.gestion}  // El valor actual del campo en el formulario
                placeholder="Ingrese los gestion"
                color={errors.gestion ? "danger" : "success"}  // Cambiar color según el error
                errorMessage={errors.gestion}  // Mostrar el mensaje de error desde Formik
                className="block w-full"
              />
              <Input
                size="sm"
                isRequired={true}
                type="text"
                label="FECHA DE DESTINO"
                variant="bordered"
                isInvalid={!!errors.startdate && touched.startdate}  // Mostrar error si hay error y el campo ha sido tocado
                onChange={(e) => handleDateInput(e, setFieldValue)}
                onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                name="startdate"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                value={values.startdate}  // El valor actual del campo en el formulario
                placeholder="Ingrese los startdate"
                color={errors.startdate ? "danger" : "success"}  // Cambiar color según el error
                errorMessage={errors.startdate}  // Mostrar el mensaje de error desde Formik
                className="block w-full"
              />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
            <Textarea
              key="bordered"
              className="col-span-12 md:col-span-6 mb-6 md:mb-0"
              label="DESCRIPCION DE MOTIVO"
              placeholder="Enter your description"
              variant="bordered"
              isRequired={true}
              type="text"
              isInvalid={!!errors.motivo && touched.motivo}  // Mostrar error si hay error y el campo ha sido tocado
              onChange={(e) => {
                // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                handleChange({
                  target: { name: e.target.name, value: e.target.value.toUpperCase() },
                });
              }}
              onBlur={handleBlur}  // Manejar cuando el input pierde el foco
              name="motivo"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
              value={values.motivo}  // El valor actual del campo en el formulario
              color={errors.motivo ? "danger" : "success"}  // Cambiar color según el error
              errorMessage={errors.motivo}  // Mostrar el mensaje de error desde Formik
            />
            </div>
          </ModalBody>
          <ModalFooter>
          <Button color="danger" variant="light" onClick={() => {
              resetForm();  // Call reset form function
              onClose();    // Call close function
            }}>
            {closeLabel}
          </Button>
          {/* disabled={loading} */}
          <Button color="primary" type="submit"  >
            {actionLabel}
          </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CustomModalDest;
