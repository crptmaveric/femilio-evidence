// screens/LoginScreen.tsx
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LoginScreenProps, Routes } from "../types";

const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const { login } = useContext(AuthContext);
    const [error, setError] = useState<string | null>(null);

    const validationSchema = Yup.object().shape({
        login: Yup.string().required('Required'),
        password: Yup.string().min(4, 'Too Short!').required('Required')
    });

    return (
        <Formik
            initialValues={{ login: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
                setError(null);
                try {
                    await login(values.login, values.password);
                    navigation.replace(Routes.AdminDashboard); // Navigate to AdminDashboard upon successful login
                } catch (e) {
                    setError('Invalid username or password');
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                <View style={styles.container}>
                    {error && <Text style={styles.error}>{error}</Text>}
                    <TextInput
                        placeholder="Login"
                        onChangeText={handleChange('login')}
                        onBlur={handleBlur('login')}
                        value={values.login}
                        style={styles.input}
                    />
                    {touched.login && errors.login && <Text style={styles.error}>{errors.login}</Text>}
                    <TextInput
                        placeholder="Password"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        secureTextEntry
                        style={styles.input}
                    />
                    {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
                    <Button onPress={handleSubmit as any} title="Login" disabled={isSubmitting} />
                    <Button onPress={() => {
                        navigation.navigate(Routes.RegisterScreen);
                    }} title="Register" />
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

export default LoginScreen;
