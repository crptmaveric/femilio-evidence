import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getDatabaseConnection } from '../database';
import { EditPatientProps, PatientValues } from '../types';
import PatientForm from '../forms/PatientForm';
import FeButton from '../components/FeButton';

const EditPatient = ({ navigation, route }: EditPatientProps) => {
    const [originalValues, setOriginalValues] = useState<PatientValues | null>(null);
    const [isModified, setIsModified] = useState(false);
    const formikRef = useRef(null);

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        diagnosis: Yup.string().optional(),
        street: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        postalCode: Yup.string().required('Required'),
        country: Yup.string().required('Required'),
        birthNumber: Yup.string().required('Required'),
        doctorId: Yup.number().required('Required'),
    });

    useEffect(() => {
        const loadPatientData = async () => {
            const db = await getDatabaseConnection();
            const patientId = route.params.patientId;
            const results = await db.executeSql('SELECT * FROM Patients WHERE id = ?', [patientId]);
            if (results[0].rows.length > 0) {
                const patientData = results[0].rows.item(0);
                const addressParts = patientData.address.split(', ');
                const patientValues: PatientValues = {
                    firstName: patientData.firstName,
                    lastName: patientData.lastName,
                    diagnosis: patientData.diagnosis,
                    street: addressParts[0],
                    city: addressParts[1],
                    postalCode: addressParts[2],
                    country: addressParts[3],
                    birthNumber: patientData.birthNumber,
                    doctorId: patientData.doctorId,
                    photo: patientData.photo,
                };
                setOriginalValues(patientValues);
            }
        };

        loadPatientData();
    }, [route.params.patientId]);

    const handleSave = async (values: PatientValues) => {
        if (JSON.stringify(values) !== JSON.stringify(originalValues)) {
            const db = await getDatabaseConnection();
            const address = `${values.street}, ${values.city}, ${values.postalCode}, ${values.country}`;
            await db.executeSql(
                'UPDATE Patients SET firstName = ?, lastName = ?, diagnosis = ?, address = ?, birthNumber = ?, photo = ?, doctorId = ? WHERE id = ?',
                [values.firstName, values.lastName, values.diagnosis, address, values.birthNumber, values.photo, values.doctorId, route.params.patientId]
            );
            navigation.goBack();
        }
    };

    const checkIfModified = useCallback((values) => {
        setIsModified(JSON.stringify(values) !== JSON.stringify(originalValues));
    }, [originalValues]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <FeButton
                    severity={isModified ? "primary" : "tertiary"}
                    title={'Save'}
                    onPress={() => {
                        if (isModified) {
                            console.log('Save button pressed');
                            formikRef.current?.submitForm();
                        }
                    }}
                    disabled={!isModified}
                />
            ),
        });
    }, [navigation, isModified]);

    if (!originalValues) {
        return null; // or some loading indicator
    }

    return (
        <Formik
            innerRef={formikRef}
            initialValues={originalValues}
            validationSchema={validationSchema}
            onSubmit={handleSave}
            validate={checkIfModified}
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

export default EditPatient;
