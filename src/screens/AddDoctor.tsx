import React from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getDatabaseConnection } from '../database';
import { AddDoctorProps } from "../types";

const AddDoctor = ({ navigation }: AddDoctorProps) => {
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        login: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required')
    });

    const handleAddDoctor = async (values: { firstName: string; lastName: string; login: string; email: string; password: string }) => {
        const db = await getDatabaseConnection();
        await db.executeSql(
            'INSERT INTO Users (firstName, lastName, login, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
            [values.firstName, values.lastName, values.login, values.email, values.password, 'doctor']
        );
        navigation.goBack();
    };

    return (
        <Formik
            initialValues={{ firstName: '', lastName: '', login: '', email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleAddDoctor}
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
                    <TextInput
                        placeholder="Password"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        secureTextEntry
                        style={styles.input}
                    />
                    {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
                    <Button onPress={handleSubmit as any} title="Add Doctor" />
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

export default AddDoctor;
