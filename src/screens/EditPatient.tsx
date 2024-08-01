import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { getDatabaseConnection } from '../database';
import { EditPatientProps, Routes } from "../types";
import { appStyle } from "../theme/AppStyle";
import { PatientValues } from "./AddPatient";
import PatientForm from "../forms/PatientForm";
import FeButton from "../components/FeButton";

const EditPatient = ({ navigation, route }: EditPatientProps) => {
    const patientId = route.params.patientId;
    const [initialValues, setInitialValues] = useState<PatientValues>({
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
    });

    const formikRef = useRef<FormikProps<PatientValues>>(null);

    useEffect(() => {
        const fetchPatient = async () => {
            const db = await getDatabaseConnection();
            const result = await db.executeSql('SELECT * FROM Patients WHERE id = ?', [patientId]);
            const patient = result[0].rows.item(0);
            const addressParts = patient.address.split(', ');
            setInitialValues({
                firstName: patient.firstName,
                lastName: patient.lastName,
                diagnosis: patient.diagnosis,
                street: addressParts[0],
                city: addressParts[1],
                postalCode: addressParts[2],
                country: addressParts[3],
                birthNumber: patient.birthNumber,
                doctorId: patient.doctorId.toString(),
                photo: patient.photo,
            });
        };

        fetchPatient();
    }, [patientId]);

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        diagnosis: Yup.string().optional(),
        street: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        postalCode: Yup.string().required('Required'),
        country: Yup.string().required('Required'),
        birthNumber: Yup.string().required('Required'),
        doctorId: Yup.number().required('Required')
    });

    const handleSavePatient = async (values: PatientValues) => {
        const db = await getDatabaseConnection();
        await db.executeSql(
            'UPDATE Patients SET firstName = ?, lastName = ?, diagnosis = ?, address = ?, birthNumber = ?, photo = ?, doctorId = ? WHERE id = ?',
            [values.firstName, values.lastName, values.diagnosis, `${values.street}, ${values.city}, ${values.postalCode}, ${values.country}`, values.birthNumber, values.photo, values.doctorId, patientId]
        );
        navigation.goBack();
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <FeButton
                    severity={"tertiary"}
                    title={'Save'}
                    disabled={!(formikRef.current?.touched)}
                    onPress={() => formikRef.current?.submitForm()}
                />
            ),
        });
    }, [navigation, formikRef.current?.touched]);

    return (
        <Formik
            innerRef={formikRef}
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSavePatient}
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
        gap: appStyle.spacing.m,
        justifyContent: 'flex-start',
        padding: 16,
    },
});

export default EditPatient;
