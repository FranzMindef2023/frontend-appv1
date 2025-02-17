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
import { usePersonas } from "@/context/PersonasContext";
import { useHomes } from "@/context/HomeContext";
import { useOrganigrama } from "@/context/OrganigramaContext";
import { useCargo } from "@/context/GargosContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const CustomModalDest = ({ isOpen, onClose, title, actionLabel, closeLabel, initialData, initialAssing}) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedItem, setSelectedItem] = useState([]);
  const { fetchOrgPhat,getOrgByIdPhat,organPhat,orgChil,isInitialized,loading,orgChilphat,getOrganigramaByHijo} = useOrganigrama();
  const { cargos,fetchCargos, isInitializedCar } = useCargo();
  const { createAsignacion,updateAsignacion,changeAssignment} = usePersonas();
  const { fetchReparticion,isInitialRepart,reparticion} = useHomes();

  useEffect(() => {
    
    if (!isInitialized) fetchOrgPhat();
    if (!isInitializedCar) fetchCargos();
    if (!isInitialRepart) fetchReparticion();
  },[isInitialized,isInitializedCar,isInitialRepart]);
  const {handleSubmit,handleBlur,values,handleChange,errors,touched,resetForm,setFieldValue }= useFormik({
    initialValues:{
      gestion:new Date().getFullYear().toString(),
      startdate: '',
      status:true,
      idorg:[],
      idorgani:[],
      code:[],
      idhijastro:[],
      idpuesto:[],
      motivo:'',
      ...initialData,
      ...initialAssing
    },
    enableReinitialize: true,
    onSubmit:async (values) =>{
      try {
        if (initialAssing?.idassig) {
          if (values.action === 'update') {
            await updateAsignacion(values); // Asume que tienes esta función
          } else if (values.action === 'change') {
            await changeAssignment(values);
          }
        } else {
          await createAsignacion(values);
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
      .required("La fecha de destino es obligatoria"),
      idorgani: Yup.number()
            .required('Debes seleccionar la reparticion') 
            .typeError('Debes seleccionar la reparticion'),
      code: Yup.number()
            .required('Debes seleccionar destino anterior') 
            .typeError('Debes seleccionar destino anterior'),
      idorg: Yup.number()
      .required('Debes seleccionar la unidad dependiente') 
      .typeError('Debes seleccionar la reparticion'),
      idhijastro: Yup.number()
            .required('Debes seleccionar unidad organizacional') 
            .typeError('Debes seleccionar la reparticion'),
            idpuesto: Yup.number()
      .required('Debes seleccionar un cargo') 
      .typeError('Debes seleccionar la reparticion'),

    })
  });
  // Configurar el rol seleccionado basado en `assigned`
  useEffect(() => {
    console.log(initialAssing);
    if (initialData?.idorg) {
      const selectedOrg = organPhat.find((item) => item.idorg === Number(initialData.idorg)); // Forzar a tipo número
      setSelectedItem(selectedOrg);
      setFieldValue('idorg', selectedOrg?.idorg || ''); // Actualiza Formik
    }
    if(initialAssing?.idorgani){
      handleFilter(initialAssing.idorgani);
    }
    if(initialAssing?.idhijastro){
      getOrgByIdPhat(initialAssing.idhijastro);
    }
  }, [initialData,initialAssing]);

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
              name="idorgani"
              className="block w-full"
              isInvalid={!!errors.idorgani && touched.idorgani}
              color={errors.idorgani ? "danger" : "success"}
              errorMessage={errors.idorgani} 
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
                isInvalid={!!errors.idhijastro && touched.idhijastro}
                color={errors.idhijastro ? "danger" : "success"}
                errorMessage={errors.idhijastro} 
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
                isInvalid={!!errors.idorg && touched.idorg}
                color={errors.idorg ? "danger" : "success"}
                errorMessage={errors.idorg} 
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
                isInvalid={!!errors.idpuesto && touched.idpuesto}
                color={errors.idpuesto ? "danger" : "success"}
                errorMessage={errors.idpuesto} 
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
                placeholder="Ingrese la descripcion"
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
            {initialAssing === null && (
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Autocomplete
                size="sm"
                isRequired
                label="DESTINO ANTERIOR"
                variant="bordered"
                className="block w-full"
                isInvalid={!!errors.code && touched.code}
                color={errors.code ? "danger" : "success"}
                errorMessage={errors.code}
                selectedKey={values.code ? String(values.code) : undefined} // Asegúrate de que es una cadena
                onSelectionChange={(key) => {
                  if (!key) {
                    setFieldValue('code', ''); // Limpia el valor en Formik
                    setfuerza(null); // Limpia el estado local
                    return;
                  }
                  const selectedExped = reparticion.find((item) => item.code === Number(key)); // Convertir clave a número
                  setFieldValue('code', selectedExped?.code || ''); // Actualiza Formik
                  setfuerza(selectedExped); // Actualiza el estado local
                }}
                defaultItems={reparticion}
              >
                {(item) => <AutocompleteItem key={String(item.code)}>{item.reparticion}</AutocompleteItem>}
              </Autocomplete>
            </div>
            )}
          </ModalBody>
          <ModalFooter>
            {/* Botón para cerrar el modal */}
            <Button 
              color="danger" 
              variant="light" 
              onClick={() => {
                resetForm();  // Llamar la función para resetear el formulario
                onClose();    // Llamar la función para cerrar el modal
              }}
            >
              {closeLabel}
            </Button>

            {/* Mostrar botones condicionalmente */}
            {initialAssing === null ? (
              // Mostrar solo el botón de "submit" si initialAssing es null
              <Button color="primary" type="submit">
                {actionLabel}
              </Button>
            ) : (
              // Mostrar los botones "Actualizar" y "Cambiar" si initialAssing no es null
              <>
                <Button 
                  color="warning" 
                  type="submit"
                  onClick={() => (setFieldValue('action', 'update'))}
                >
                  ACTUALIZAR DATOS
                </Button>
                <Button 
                  type="submit"
                  color="secondary" 
                  onClick={() => (setFieldValue('action', 'change'))}
                >
                  CAMBIAR DE REPARTICIÓN
                </Button>
              </>
            )}
          </ModalFooter>

        </form>
      </ModalContent>
    </Modal>
  );
};

export default CustomModalDest;
