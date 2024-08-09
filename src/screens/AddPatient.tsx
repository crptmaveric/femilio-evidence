import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Alert, View, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AddPatientProps } from "../types";
import PatientForm from "../forms/PatientForm";
import { saveImage, handleSavePatient } from '../utils/patientHelpers';
import { PatientValues } from '../types';
import CustomHeader from '../components/CustomHeader';

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

const AddPatient = ({ navigation, route }: AddPatientProps) => {
    const formikRef = useRef(null);
    const doctorId = route.params.doctorId;

    const handleCancel = (dirty) => {
        if (dirty) {
            Alert.alert(
                'Discard changes?',
                'You have unsaved changes. Are you sure you want to discard them and leave the screen?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    const handleSave = async (values: PatientValues) => {
        const imagePath = await saveImage(values.photo);
        await handleSavePatient({ ...values, photo: imagePath });
        navigation.goBack();
    };

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
                doctorId: doctorId,
                photo: '',
            } as PatientValues}
            validationSchema={validationSchema}
            onSubmit={handleSave}
        >
            {(formikProps) => {
                useEffect(() => {
                    navigation.setOptions({
                        headerTransparent: true,
                        header: () => (
                            <SafeAreaView style={{ flex: 1 }}>
                                <CustomHeader
                                    saveTitle="Save"
                                    title=""
                                    showClose={true}
                                    iconOnly={true}
                                    onCancel={() => handleCancel(formikProps.dirty)}
                                    onSave={formikProps.handleSubmit}
                                    isModified={formikProps.dirty}
                                />
                            </SafeAreaView>
                        ),
                    });
                }, [navigation, formikProps.dirty, formikProps.handleSubmit]);

                return (
                    <SafeAreaView style={{ flex: 1 }}>
                        <PatientForm {...formikProps} navigation={navigation} type={'add'} />
                    </SafeAreaView>
                );
            }}
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
