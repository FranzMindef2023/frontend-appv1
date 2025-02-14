import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Autocomplete, 
  AutocompleteItem,
  Textarea,
  Alert
} from "@nextui-org/react";
import { usePersonas } from "@/context/PersonasContext";
import { useTipNov } from "@/context/TipoNovedadContext"; 
import { useNovedades } from "@/context/NovedadesContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const CustomModals = ({ isOpen, onClose, title, actionLabel, closeLabel, initialData}) => {
  const [selectedItem, setSelectedItem] = useState([]);
  const { isInitPersonal,fetchListPersonas,personal} = usePersonas();
  const { isInitializedNov,fetchTipNovs,novedad} = useTipNov();
  const {createNovedad,updateNovedad,getVerificadorId,getVerificadorIdFecha,getVerificadorIdCantidad}=useNovedades();
  const [alertVisible, setAlertVisible] = useState(false);
  const [color, setColor] = useState('');
  const [menssage, setMenssage] = useState('');
  const today = new Date();
today.setHours(0, 0, 0, 0); // Elimina la hora para evitar problemas de validación
  useEffect(() => {

    if (!isInitPersonal) fetchListPersonas();
    if (!isInitializedNov) fetchTipNovs();
  },[isInitPersonal,isInitializedNov]);
  const {handleSubmit,handleBlur,values,handleChange,errors,touched,resetForm,setFieldValue, Field}= useFormik({
    initialValues:{
      idassig:[],
      idnov:[],
      descripcion: '',
      activo:true,
      enddate:'',
      startdate:'',
      ...initialData,
    },
    enableReinitialize: true,
    onSubmit:async (values) =>{
      // console.log(values);
      try {
        if (initialData?.idnovedad) {
          await updateNovedad(values);
        } else {
          await createNovedad(values);
        }
        resetForm();
        onClose();
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario');
      }
      
    },
    validationSchema:Yup.object({
      descripcion: Yup.string().max(250,'Debe tener maximo de 250 caracteres').required('Campo requerido'),
      idassig: Yup.number()
            .required('Debes seleccionar la persona') 
            .typeError('Debes seleccionar la persona'),
      idnov: Yup.number()
          .required('Debes seleccionar el tipo de permiso') 
          .typeError('Debes seleccionar el tipo de permiso'),
      startdate: Yup.date()
      .required('La fecha desde es obligatoria.')
      .typeError('Debe ser una fecha válida.')
      .min(today, 'No puedes seleccionar una fecha pasada.') ,
      enddate: Yup.date()
          .required('La fecha hasta es obligatoria.')
          .typeError('Debe ser una fecha válida.')
          .min(Yup.ref('startdate'), 'La fecha hasta debe ser igual o posterior a la fecha desde.'),
      })
  });
  // Configurar el rol seleccionado basado en `assigned`
  useEffect(() => {
    if (initialData?.idnovedad) {
      // const selectedOrg = organPhat.find((item) => item.idorg === Number(initialData.idorg)); // Forzar a tipo número
      // setSelectedItem(selectedOrg);
      // setFieldValue('idorg', selectedOrg?.idorg || ''); // Actualiza Formik
    }
  }, [initialData]);

  const handleFilter = async (key) => {
    try {
      const idAssig = values.idassig; // ID de asignación que se busca en el array
      if(idAssig.length===0){
        setColor('danger');
        setMenssage('Seleccione la persona');
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);
        return;
      }
      
  
      // Buscar en el array `personal` el elemento que tenga el mismo `idassig`
      const selectedData = personal.find((item) => item.idassig === idAssig);
  
      // console.log(selectedData);
      // return;
      const response=await getVerificadorId(selectedData.idpersona,key);
      if(response.message!='ok'){
        setColor('warning');
        setMenssage(response.message);
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);
        return;
      }
      
  
      // await getOrganigramaByHijo(key); // Descomentar si es necesario
  
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar usuario");
    }
  };
  const handleDateSelection = async (date) => {
    try {
      const idAssig = values.idassig;
      const idnov = values.idnov; // ID de asignación que se busca en el array
      if(idAssig.length===0){
        setColor('danger');
        setMenssage('Seleccione la persona');
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);
        return;
      }
      if(idnov.length===0){
        setColor('danger');
        setMenssage('Seleccione el tipo de permiso');
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);
        return;
      }
      
  
      // Buscar en el array `personal` el elemento que tenga el mismo `idassig`
      const selectedData = personal.find((item) => item.idassig === idAssig);
  
      // console.log(selectedData);
      // return;
      const response=await getVerificadorIdFecha(selectedData.idpersona,idnov,date);
      if(response.message!='ok'){
        setColor('warning');
        setMenssage(response.message);
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);
        return;
      }
      
  
      // await getOrganigramaByHijo(key); // Descomentar si es necesario
  
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar usuario");
    }
  };
  
  const handleVerifiVacaciones = async (date) => {
    try {
      const idAssig = values.idassig;
      const idnov = values.idnov; // ID de asignación que se busca en el array
      const startdate = values.startdate;
      if(idAssig.length===0){
        setColor('danger');
        setMenssage('Seleccione la persona');
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);
        return;
      }
      if(idnov.length===0){
        setColor('danger');
        setMenssage('Seleccione el tipo de permiso');
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);
        return;
      }
      if(startdate===''){
        setColor('danger');
        setMenssage('Seleccione la fecha desde');
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000);
        return;
      }
      
  
      // Buscar en el array `personal` el elemento que tenga el mismo `idassig`
      const selectedData = personal.find((item) => item.idassig === idAssig);
  
      // console.log(selectedData);
      // return;
      const response=await getVerificadorIdCantidad(selectedData.idpersona,idnov,startdate,date);
      // console.log(response);
      if(response.message!='ok'){
        setColor('warning');
        setMenssage(response.message);
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 5000);
        return;
      }
      
  
      // await getOrganigramaByHijo(key); // Descomentar si es necesario
  
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar usuario");
    }
  };
  
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} size="lg">
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <form noValidate onSubmit={handleSubmit}>
          <ModalBody>
            {alertVisible && (
              <Alert 
                color={color} 
                title={menssage} 
              />
            )}
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
            <Autocomplete
              size="sm"
              isRequired
              label="Seleccione a la persona"
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
              label="Selecione tipo de permiso"
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
              <Input 
              isRequired 
              name="startdate"
              label="FECHA DESDE" 
              type="date" 
              onBlur={handleBlur}  
              onChange={(e) => {
                handleChange(e);
                handleDateSelection(e.target.value); // Nueva función para manejar la fecha seleccionada
              }}
              isInvalid={!!errors.startdate && touched.startdate}
              color={errors.startdate ? "danger" : "success"}
              errorMessage={errors.startdate} 
              className="block w-full"
              variant="bordered"
              />
            
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
            <Input 
              isRequired 
              name="enddate"
              label="FECHA HASTA"
              type="date" 
              onBlur={handleBlur}  
              onChange={(e) => {
                handleChange(e);
                handleVerifiVacaciones(e.target.value); // Nueva función para manejar la fecha seleccionada
              }}
              isInvalid={!!errors.enddate && touched.enddate}
              color={errors.enddate ? "danger" : "success"}
              errorMessage={errors.enddate} 
              className="block w-full"
              variant="bordered"
              />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
            <Textarea
              key="bordered"
              className="col-span-12 md:col-span-6 mb-6 md:mb-0"
              label="DESCRIPCION DEL PERMISO"
              placeholder="Ingrese la descripcion"
              variant="bordered"
              isRequired={true}
              type="text"
              isInvalid={!!errors.descripcion && touched.descripcion}  // Mostrar error si hay error y el campo ha sido tocado
              onChange={(e) => {
                // Convierte el valor ingresado a mayúsculas antes de actualizar Formik
                handleChange({
                  target: { name: e.target.name, value: e.target.value.toUpperCase() },
                });
              }}
              onBlur={handleBlur}  // Manejar cuando el input pierde el foco
              name="descripcion"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
              value={values.descripcion}  // El valor actual del campo en el formulario
              color={errors.descripcion ? "danger" : "success"}  // Cambiar color según el error
              errorMessage={errors.descripcion}  // Mostrar el mensaje de error desde Formik
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
              <Button color="primary" type="submit">
                {actionLabel}
              </Button>
          </ModalFooter>

        </form>
      </ModalContent>
    </Modal>
  );
};

export default CustomModals;
