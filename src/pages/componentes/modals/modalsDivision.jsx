import React,{useState} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,Input } from "@nextui-org/react";
const CustomModal = ({ isOpen, onClose, title, actionLabel, closeLabel }) => {
  const {handleSubmit,handleBlur,values,handleChange,errors,touched,resetForm }= useFormik({
    initialValues:{
      depart: '',
      codigo:''
    },
    onSubmit:(values)=>{
      console.log(values);
      resetForm();
      onClose()
    },
    validationSchema:Yup.object({
      depart: Yup.string().max(50,'Debe tener maximo de 50 caracteres').required('Campo es requerido'),
      codigo:Yup.string()
      .matches(/^[0-9]{1,15}$/, 'El número de celular debe tener entre 1 y 9 dígitos')
      .required('Campo es requerido')
    })
  });

  
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false} >
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
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-6">
            <Input
                  size="sm"
                  isRequired={true}
                  type="text"
                  label="Departamento"
                  variant="bordered"
                  isInvalid={!!errors.depart && touched.depart}  // Mostrar error si hay error y el campo ha sido tocado
                  onChange={handleChange}  // Manejar el cambio con Formik
                  onBlur={handleBlur}  // Manejar cuando el input pierde el foco
                  name="depart"  // Nombre del campo en el formulario (debe coincidir con el campo en initialValues y validationSchema)
                  value={values.depart}  // El valor actual del campo en el formulario
                  placeholder="Ingrese el nombre del departamento"
                  color={errors.depart ? "danger" : "success"}  // Cambiar color según el error
                  errorMessage={errors.depart}  // Mostrar el mensaje de error desde Formik
                  className="block w-full"
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
