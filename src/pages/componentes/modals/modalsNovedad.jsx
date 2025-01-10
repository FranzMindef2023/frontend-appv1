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
  Textarea,
  DatePicker
} from "@nextui-org/react";
import {now, getLocalTimeZone} from "@internationalized/date";
import { usePersonas } from "@/context/PersonasContext";
import { useTipNov } from "@/context/TipoNovedadContext";
import { useOrganigrama } from "@/context/OrganigramaContext";
import { useCargo } from "@/context/GargosContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const CustomModals = ({ isOpen, onClose, title, actionLabel, closeLabel, initialData, initialAssing}) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedItem, setSelectedItem] = useState([]);
  const { fetchOrgPhat,getOrgByIdPhat,organPhat,orgChil,isInitialized,loading,orgChilphat,getOrganigramaByHijo} = useOrganigrama();
  const { cargos,fetchCargos, isInitializedCar } = useCargo();
  const { createAsignacion,updateAsignacion,changeAssignment,isInitPersonal,fetchListPersonas,personal} = usePersonas();
  const { isInitializedNov,fetchTipNovs,novedad} = useTipNov();
  useEffect(() => {
    
    if (!isInitialized) fetchOrgPhat();
    if (!isInitializedCar) fetchCargos();
    if (!isInitPersonal) fetchListPersonas();
    if (!isInitializedNov) fetchTipNovs();
  },[isInitialized,isInitializedCar,isInitPersonal,isInitializedNov]);
  const {handleSubmit,handleBlur,values,handleChange,errors,touched,resetForm,setFieldValue }= useFormik({
    initialValues:{
      gestion:new Date().getFullYear().toString(),
      startdate: '',
      status:true,
      idorg:[],
      idorgani:[],
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

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} size="lg">
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <form noValidate onSubmit={handleSubmit}>
          <ModalBody>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
            <Autocomplete
              size="sm"
              isRequired
              label="Buscar repaticion"
              variant="bordered"
              name="idassig"
              className="block w-full"
              isInvalid={!!errors.idassig && touched.idassig}
              color={errors.idassig ? "danger" : "success"}
              errorMessage={errors.idassig} 
              selectedKey={values.idassig ? String(values.idassig) : undefined} // Maneja valores vacíos correctamente
              onSelectionChange={(key) => {
                if (!key) {
                  
                  setFieldValue('idassig', ''); // Limpia el valor en Formik
                  setSelectedItem(null); // Limpia el estado local
                  return;
                }
                handleFilter(key);
                const selectedOrg = personal.find((item) => item.idassig === Number(key));
                setFieldValue('idassig', selectedOrg?.idassig || ''); // Actualiza Formik
                setSelectedItem(selectedOrg); // Actualiza el estado local
              }}
              defaultItems={personal}
            >
              {(item) => <AutocompleteItem key={String(item.idassig)}>{item.name}</AutocompleteItem>}
            </Autocomplete>
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
            <Autocomplete
              size="sm"
              isRequired
              label="Buscar repaticion"
              variant="bordered"
              name="idnov"
              className="block w-full"
              isInvalid={!!errors.idnov && touched.idnov}
              color={errors.idnov ? "danger" : "success"}
              errorMessage={errors.idnov} 
              selectedKey={values.idnov ? String(values.idnov) : undefined} // Maneja valores vacíos correctamente
              onSelectionChange={(key) => {
                if (!key) {
                  
                  setFieldValue('idnov', ''); // Limpia el valor en Formik
                  setSelectedItem(null); // Limpia el estado local
                  return;
                }
                handleFilter(key);
                const selectedOrg = novedad.find((item) => item.idnov === Number(key));
                setFieldValue('idnov', selectedOrg?.idnov || ''); // Actualiza Formik
                setSelectedItem(selectedOrg); // Actualiza el estado local
              }}
              defaultItems={novedad}
            >
              {(item) => <AutocompleteItem key={String(item.idnov)}>{item.novedad}</AutocompleteItem>}
            </Autocomplete>
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
            <DatePicker
              hideTimeZone
              showMonthAndYearPickers
              defaultValue={now(getLocalTimeZone())}
              label="Event Date"
              variant="bordered"
            />
            <DatePicker
              hideTimeZone
              showMonthAndYearPickers
              defaultValue={now(getLocalTimeZone())}
              label="Event Date"
              variant="bordered"
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
                  CAMBIAR DE REPARTICION
                </Button>
              </>
            )}
          </ModalFooter>

        </form>
      </ModalContent>
    </Modal>
  );
};

export default CustomModals;
