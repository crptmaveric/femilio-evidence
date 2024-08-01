import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getDatabaseConnection } from '../database';
import { EditDoctorProps } from "../types";

const EditDoctor = ({ route, navigation }: EditDoctorProps) => {
    const { doctorId } = route.params;
    const [initialValues, setInitialValues] = useState({ firstName: '', lastName: '', login: '', email: '' });

    useEffect(() => {
        const fetchDoctor = async () => {
            const db = await getDatabaseConnection();
            const result = await db.executeSql('SELECT * FROM Users WHERE id = ?', [doctorId]);
            const doctor = result[0].rows.item(0);
            setInitialValues({ firstName: doctor.firstName, lastName: doctor.lastName, login: doctor.login, email: doctor.email });
        };

        fetchDoctor();
    }, [doctorId]);

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        login: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required')
    });

    const handleSaveDoctor = async (values: { firstName: string; lastName: string; login: string; email: string }) => {
        const db = await getDatabaseConnection();
        await db.executeSql('UPDATE Users SET firstName = ?, lastName = ?, login = ?, email = ? WHERE id = ?', [values.firstName, values.lastName, values.login, values.email, doctorId]);
        navigation.goBack();
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSaveDoctor}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.container}>
                    <TextInput
                        placeholder="First Name"
                        onChangeText={handleChange('firstName')}
                        onBlur={handleBlur('firstName')}
                        value={values.firstName}
                        style={styles.input}
                    />
                    {touched.firstName && errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}
                    <TextInput
                        placeholder="Last Name"
                        onChangeText={handleChange('lastName')}
                        onBlur={handleBlur('lastName')}
                        value={values.lastName}
                        style={styles.input}
                    />
                    {touched.lastName && errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}
                    <TextInput
                        placeholder="Login"
                        onChangeText={handleChange('login')}
                        onBlur={handleBlur('login')}
                        value={values.login}
                        style={styles.input}
                    />
                    {touched.login && errors.login && <Text style={styles.error}>{errors.login}</Text>}
                    <TextInput
                        placeholder="Email"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        style={styles.input}
                    />
                    {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
                    <Button onPress={handleSubmit as any} title="Save Doctor" />
                </View>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 8,
    },
    error: {
        color: 'red',
        marginBottom: 8,
    },
});

export default EditDoctor;
