import React,{useState } from "react";
import * as Yup from "yup";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,Input,Autocomplete, AutocompleteItem } from "@nextui-org/react";
import {EyeFilledIcon} from "@/pages/componentes/modals/password/EyeFilledIcon";
import {EyeSlashFilledIcon} from "@/pages/componentes/modals/password/EyeSlashFilledIcon";
import { useFormik } from "formik";
import {animals} from "@/data/selectdata";


const CustomModal = ({ isOpen, onClose, title, bodyContent, onAction, actionLabel, closeLabel }) => {
  const [value, setValue] = React.useState("");
  const {handleSubmit,handleBlur,values,handleChange,errors,touched,resetForm }= useFormik({
    initialValues:{
      codigo: '',
      nombre: '',
      distrito: '',
      zona: '',
      direccion: '',
      itemdepart:''
    },
    onSubmit:(values)=>{
      console.log(values);
      resetForm();
      onClose()
    },
    validationSchema:Yup.object({
      codigo: Yup.string()
      .matches(/^[0-9]{5,15}$/, 'El codigo debe tener entre 5 y 15 dígitos')
      .required('El codigo es requerido'),
      nombre:Yup.string().max(100,'Debe tenere maximo 100 caracteres').min(3,'Debe tener como minimo 3 caracteres').required('El nombre de U.E. es requerido'),
      distrito: Yup.string().max(50,'Debe tenere maximo 50 caracteres').required('El distrito es requerido'),
      zona: Yup.string().max(50,'Debe tenere maximo 50 caracteres').required('Campo es requerido'),
      direccion: Yup.string().min(3,'Debe tener minimo 3 caracteres').max(150,'Debe tener maximo 150 caracteres').required('Campo requerido'),
      // itemdepart:Yup.string().required('El campo es requerido')

    })
  });

 


  

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} size="4xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <form noValidate onSubmit={handleSubmit}>
              <ModalBody>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
                <Input
                  size="sm"
                  isRequired={true}
                  type="text"
                  label="Codigo"
                  variant="bordered"
                  isInvalid={!!errors.codigo && touched.codigo}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={handleChange}  // Manejar el cambio con Formik
                  onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                  name="codigo"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.codigo}  // El valor actual del campo en el formulario
                  placeholder="Ingrese el codigo"
                  color={errors.codigo ? "danger" : "success"}  // Cambiar color según el error
                  errorMessage={errors.codigo}  // Mostrar el mensaje de error desde Formik
                  className="block w-full"
                />
                <Input 
                size="sm" 
                type="text" 
                label="Nombre de U.E." 
                name="nombre" 
                variant="bordered"
                placeholder="Ingrese el nombre de la UE" 
                value={values.nombre}
                isInvalid={!!errors.nombre && touched.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                color={errors.nombre ? "danger" : "success"}
                errorMessage={errors.nombre}
                className="block w-full"
                />
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Input 
                size="sm" 
                type="text" 
                label="Distrito" 
                variant="bordered"
                name="distrito"
                placeholder="Ingrese el distrito"
                value={values.distrito}
                isInvalid={!!errors.distrito && touched.distrito}
                onChange={handleChange}
                onBlur={handleBlur}
                color={errors.distrito ? "danger" : "success"}
                errorMessage={errors.distrito}
                className="block w-full"
                />
                <Input 
                isRequired
                size="sm" 
                value={values.zona}
                name="zona"
                type="text" 
                label="Zona" 
                placeholder="Ingrese la zona" 
                variant="bordered"
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.zona && touched.zona}
                color={errors.zona ? "danger" : "success"}
                errorMessage={errors.zona}
                className="block w-full "/>
              </div>
              <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
              <Input 
                size="sm" 
                type="text" 
                isRequired
                name="direccion"
                label="Direccion" 
                variant="bordered"
                placeholder="Ingrese la direccion"
                
                value={values.direccion}
                isInvalid={!!errors.direccion && touched.direccion}
                onChange={handleChange}
                onBlur={handleBlur}
                color={errors.direccion ? "danger" : "success"}
                errorMessage={errors.direccion}
                className="block w-full"
                />
                <Autocomplete
                size="sm"
                name="itemdepart"
                isRequired
                allowsCustomValue
                label="Seleccione departamento"
                variant="bordered"
                className="block w-full"
                defaultItems={animals}  // Aquí asumo que 'animals' es una lista de {label, value}
                value={values.itemdepart}  // Asignar el valor actual desde Formik
                isInvalid={!!errors.itemdepart && touched.itemdepart}  // Mostrar error si es inválido
                onSelect={(item) => setFieldValue('itemdepart', item.label)}  // Usa setFieldValue para actualizar Formik
                onBlur={handleBlur}  // Marca como tocado cuando pierde el foco
                color={errors.itemdepart ? "danger" : "success"}
                errorMessage={errors.itemdepart}
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              </div>
              </ModalBody>
              <ModalFooter>
              <Button color="danger" variant="light" onClick={() => {
                  resetForm();  // Call reset form function
                  onClose();    // Call close function
                }}>
                {closeLabel}
              </Button>
                <Button color="primary" type="submit">
                  {actionLabel}
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
