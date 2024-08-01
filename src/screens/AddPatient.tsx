import React, {useLayoutEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {getDatabaseConnection} from '../database';
import {AddPatientProps, Routes} from "../types";
import {appStyle} from "../theme/AppStyle";
import PatientForm from "../forms/PatientForm";
import {Icon} from 'react-native-elements';
import {Pressable} from 'native-base';
import FeButton from "../components/FeButton";

export interface PatientValues {
    firstName: string;
    lastName: string;
    diagnosis: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    birthNumber: string;
    doctorId: string;
    photo: string;
}

const AddPatient = ({navigation, route}: AddPatientProps) => {

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

    const handleAddPatient = async (values: PatientValues) => {
        const db = await getDatabaseConnection();
        await db.executeSql(
            'INSERT INTO Patients (firstName, lastName, diagnosis, address, birthNumber, photo, doctorId) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [values.firstName, values.lastName, values.diagnosis, `${values.street}, ${values.city}, ${values.postalCode}, ${values.country}`, values.birthNumber, values.photo, values.doctorId]
        );
        navigation.goBack();
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <FeButton severity={"tertiary"} title={'Save'} onPress={() => formikRef.current?.submitForm()}/>
            ),
        });
    }, [navigation]);

    const formikRef = React.useRef(null);

    return (
        <Formik
            innerRef={formikRef}
            initialValues={{
                firstName: '',
                lastName: '',
                diagnosis: '',
                street: '',
                city: '',
                postalCode: '',
                country: '',
                birthNumber: '',
                doctorId: route.params.doctorId,
                photo: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddPatient}
        >
            {formikProps => (
                <PatientForm {...formikProps} navigation={navigation}/>
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

export default AddPatient;
