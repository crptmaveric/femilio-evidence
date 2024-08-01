import React from 'react';
import { StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AddPatientProps } from "../types";
import { appStyle } from "../theme/AppStyle";
import PatientForm from "../forms/PatientForm";
import FeButton from "../components/FeButton";
import { saveImage, handleSavePatient } from '../utils/patientHelpers';
import { PatientValues } from '../types';

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    diagnosis: Yup.string().optional(),
    street: Yup.string().optional(),
    city: Yup.string().optional(),
    postalCode: Yup.string().optional(),
    country: Yup.string().optional(),
    birthNumber: Yup.string().required('Required'),
    doctorId: Yup.number().required('Required')
});

const AddPatient = ({ navigation }: AddPatientProps) => {
    const handleSave = async (values: PatientValues) => {
        const imagePath = await saveImage(values.photo);
        await handleSavePatient({ ...values, photo: imagePath });
        navigation.goBack();
    };

    return (
        <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                diagnosis: '',
                street: '',
                city: '',
                postalCode: '',
                country: '',
                birthNumber: '',
                doctorId: '',
                photo: '',
            } as PatientValues}
            validationSchema={validationSchema}
            onSubmit={handleSave}
        >
            {formikProps => (
                <PatientForm {...formikProps} navigation={navigation} />
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        padding: 16,
    },
});

export default AddPatient;
