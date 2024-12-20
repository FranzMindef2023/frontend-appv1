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
import { useFormik } from "formik";
import * as Yup from "yup";

const CustomModalDest = ({ isOpen, onClose, title, actionLabel, closeLabel, initialData, initialDataUser}) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const { createUserRols} = useUsers();
  const {handleSubmit,handleBlur,values,handleChange,errors,touched,resetForm,setFieldValue }= useFormik({
    initialValues:{
      nombres: '',
      appaterno: '',
      apmaterno: '',
      email: '',
      usuario: '',
      password: '',
      ci:'',
      celular:'',
      status:true,
      idorg:[],
      idpuesto:[],
      grado:'',
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
      nombres: Yup.string().max(50,'Debe tener maximo de 50 caracteres').required('Campo requerido'),
      appaterno:Yup.string().max(30,'Debe tenere maximo 30 caracteres').min(3,'Debe tener como minimo 3 caracteres'),
      apmaterno: Yup.string().max(30,'Debe tenere maximo 30 caracteres'),
      email: Yup.string().email('El correo no tiene un formato corecto').required('El email es requerido'),
      usuario: Yup.string().min(3,'Debe tener minimo 3 caracteres').max(10,'Debe tener maximo 10 caracteres').required('Campo requerido'),
      password: Yup.string().nullable()
      .min(5, 'La contraseña debe tener al menos 5 caracteres')
      .max(15, 'La contraseña no debe exceder los 15 caracteres')
      .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
      .matches(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
      .matches(/\d/, 'La contraseña debe contener al menos un número')
      .matches(/[@$!%*?&#]/, 'La contraseña debe contener al menos un carácter especial (@$!%*?&#)'),
      ci:Yup.number().
      min(6000000,'La cédula debe tener minimo 6 caracteres').
      max(10000000000,'La cédula debe tener maximo 10 caracteres')
      .required('La cédula de identidad es requerida'),
      celular:Yup.string()
      .matches(/^[0-9]{8,15}$/, 'El número de celular debe tener entre 8 y 15 dígitos')
      .nullable(),
      // idorg: Yup.number()
      // .required('Es necesario seleccionar una unidad organizacional.'), 
      grado :Yup.string().max(50,'Debe tener maximo de 50 caracteres').required('Campo requerido'),
    })
  });
  // Configurar el rol seleccionado basado en `assigned`
  useEffect(() => {
    console.log(initialData);
    // if (Array.isArray(initialData)) {
    //   const initiallySelected = initialData.find((role) => role.assigned === 1);
    //   setSelectedRole(initiallySelected ? initiallySelected.idrol.toString() : null);
    // }
  }, [initialData]);

  // Manejar cambio de switches (único rol activo)
  const handleSwitchChange = (id) => {
    setSelectedRole(id); // Actualiza el rol seleccionado
  };

  // const handleSubmit = async () => {
  //   try {
  //     await createUserRols(selectedRole,initialDataUser);
  //     onClose(); // Cierra el modal
  //   } catch (error) {
  //     console.error("Error al registrar usuario:", error);
  //     alert("Error al registrar usuario");
  //   }
  // };
  
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
              <Input
                size="sm"
                isRequired={true}
                type="text"
                label="REPARTICION"
                variant="bordered"
                isInvalid={!!errors.nombres && touched.nombres}  // Mostrar error si hay error y el campo ha sido tocado
                onChange={handleChange}  // Manejar el cambio con Formik
                onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                name="nombres"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                value={values.nombres}  // El valor actual del campo en el formulario
                placeholder="Ingrese los nombres"
                color={errors.nombres ? "danger" : "success"}  // Cambiar color según el error
                errorMessage={errors.nombres}  // Mostrar el mensaje de error desde Formik
                className="block w-full"
              />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Input 
                size="sm" 
                type="text" 
                label="UNIDAD" 
                variant="bordered"
                name="apmaterno"
                placeholder="Ingrese el apellido materno"
                value={values.apmaterno}
                isInvalid={!!errors.apmaterno && touched.apmaterno}
                onChange={handleChange}
                onBlur={handleBlur}
                color={errors.apmaterno ? "danger" : "success"}
                errorMessage={errors.apmaterno}
                className="block w-full"
                />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Input 
                size="sm" 
                type="text" 
                isRequired
                name="ci"
                label="SECCION" 
                variant="bordered"
                placeholder="Ingrese el numero de ci"
                
                value={values.ci}
                isInvalid={!!errors.ci && touched.ci}
                onChange={handleChange}
                onBlur={handleBlur}
                color={errors.ci ? "danger" : "success"}
                errorMessage={errors.ci}
                className="block w-full"
                />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Input
                size="sm"
                isRequired={true}
                type="text"
                label="GESTION"
                variant="bordered"
                isInvalid={!!errors.nombres && touched.nombres}  // Mostrar error si hay error y el campo ha sido tocado
                onChange={handleChange}  // Manejar el cambio con Formik
                onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                name="nombres"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                value={values.nombres}  // El valor actual del campo en el formulario
                placeholder="Ingrese los nombres"
                color={errors.nombres ? "danger" : "success"}  // Cambiar color según el error
                errorMessage={errors.nombres}  // Mostrar el mensaje de error desde Formik
                className="block w-full"
              />
              <Input
                size="sm"
                isRequired={true}
                type="text"
                label="FECHA DE DESTINO"
                variant="bordered"
                isInvalid={!!errors.nombres && touched.nombres}  // Mostrar error si hay error y el campo ha sido tocado
                onChange={handleChange}  // Manejar el cambio con Formik
                onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                name="nombres"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                value={values.nombres}  // El valor actual del campo en el formulario
                placeholder="Ingrese los nombres"
                color={errors.nombres ? "danger" : "success"}  // Cambiar color según el error
                errorMessage={errors.nombres}  // Mostrar el mensaje de error desde Formik
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
            />
            {/* <Autocomplete
              size="sm"
              isRequired
              label="Buscar unidad orgnaizacional"
              variant="bordered"
              className="block w-full"
              selectedKey={values.idorg ? String(values.idorg) : undefined} // Maneja valores vacíos correctamente
              onSelectionChange={(key) => {
                if (!key) {
                  setFieldValue('idorg', ''); // Limpia el valor en Formik
                  setItem(null); // Limpia el estado local
                  return;
                }

                const selectedOrg = organi.find((item) => item.idorg === Number(key));
                setFieldValue('idorg', selectedOrg?.idorg || ''); // Actualiza Formik
                setItem(selectedOrg); // Actualiza el estado local
              }}
              defaultItems={organi}
            >
              {(item) => <AutocompleteItem key={String(item.idorg)}>{item.nomorg}</AutocompleteItem>}
            </Autocomplete>
            <Autocomplete
              isRequired
              size="sm"
              label="Buscar puesto"
              variant="bordered"
              className="block w-full"
              selectedKey={values.idpuesto ? String(values.idpuesto) : undefined} // Asegúrate de que es una cadena
              onSelectionChange={(key) => {
                const selectedPuesto = cargos.find((item) => item.idpuesto === Number(key)); // Convertir clave a número
                setFieldValue('idpuesto', selectedPuesto?.idpuesto || ''); // Actualiza Formik
                setItem(selectedPuesto); // Actualiza el estado local
              }}
              defaultItems={cargos}
            >
              {(item) => <AutocompleteItem key={String(item.idpuesto)}>{item.nompuesto}</AutocompleteItem>}
            </Autocomplete> */}
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
