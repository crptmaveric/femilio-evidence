// screens/RegisterScreen.tsx
import React, { useContext, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RegisterScreenProps, Routes } from "../types";
import { deleteDatabase } from '../database';
import {Picker} from "@react-native-picker/picker";

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
    const { register } = useContext(AuthContext);
    const [error, setError] = useState<string | null>(null);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().min(4, 'Too Short!').required('Required'),
        role: Yup.string().oneOf(['admin', 'doctor'], 'Invalid role').required('Required')
    });

    const handleResetDatabase = async () => {
        Alert.alert(
            'Reset Database',
            'Are you sure you want to reset the database? This will delete all data.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        await deleteDatabase();
                        Alert.alert('Database has been reset.');
                    }
                }
            ]
        );
    };

    return (
        <Formik
            initialValues={{ name: '', email: '', password: '', role: 'doctor' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                setError(null);
                try {
                    await register(values.name, values.email, values.password, values.role);
                    navigation.replace(Routes.LoginScreen); // Navigate to LoginScreen upon successful registration
                } catch (e) {
                    setError('Registration failed');
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
                <View style={styles.container}>
                    {error && <Text style={styles.error}>{error}</Text>}
                    <TextInput
                        placeholder="Name"
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        value={values.name}
                        style={styles.input}
                    />
                    {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
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
                    <Picker
                        selectedValue={values.role}
                        onValueChange={(itemValue) => setFieldValue('role', itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Doctor" value="doctor" />
                        <Picker.Item label="Admin" value="admin" />
                    </Picker>
                    {touched.role && errors.role && <Text style={styles.error}>{errors.role}</Text>}
                    <Button onPress={handleSubmit as any} title="Register" disabled={isSubmitting} />
                    <View style={styles.separator} />
                    <Button title="Reset Database" onPress={handleResetDatabase} color="red" />
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
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 12,
    },
    separator: {
        height: 20,
    },
    error: {
        color: 'red',
        marginBottom: 8,
    },
});

export default RegisterScreen;
