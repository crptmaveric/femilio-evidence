import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getDatabaseConnection } from '../database';
import { EditPatientProps, PatientValues } from '../types';
import PatientForm from '../forms/PatientForm';
import FeButton from '../components/FeButton';
import { saveImage, handleSavePatient } from '../utils/patientHelpers';

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    diagnosis: Yup.string().optional(),
    street: Yup.string().optional(),
    city: Yup.string().optional(),
    postalCode: Yup.string().optional(),
    country: Yup.string().optional(),
    birthNumber: Yup.string().required('Required'),
    doctorId: Yup.number().required('Required'),
});

const EditPatient = ({ navigation, route }: EditPatientProps) => {
    const [originalValues, setOriginalValues] = useState<PatientValues | null>(null);
    const [isModified, setIsModified] = useState(false);
    const formikRef = useRef(null);

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
        const imagePath = await saveImage(values.photo);
        await handleSavePatient({ ...values, photo: imagePath }, route.params.patientId);
        navigation.goBack();
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <FeButton
                    severity={'tertiary'}
                    title={'Save'}
                    onPress={() => formikRef.current?.submitForm()}
                    disabled={!isModified}
                />
            ),
        });
    }, [navigation, isModified]);

    if (!originalValues) {
        return null;
    }

    return (
        <Formik
            innerRef={formikRef}
            initialValues={originalValues}
            validationSchema={validationSchema}
            onSubmit={handleSave}
            validate={(values) => setIsModified(JSON.stringify(values) !== JSON.stringify(originalValues))}
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
