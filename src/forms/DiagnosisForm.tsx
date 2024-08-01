import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FeTextInput from "../components/FeTextInput";
import FeButton from "../components/FeButton";
import { appStyle } from "../theme/AppStyle";
import { DiagnosisFormProps } from "../types";

const DiagnosisForm = ({ navigation, route }: DiagnosisFormProps) => {
    const { values, handleChange } = route.params;

    const validationSchema = Yup.object().shape({
        diagnosis: Yup.string().optional()
    });

    const handleSaveDiagnosis = async (diagnosisValues) => {
        handleChange('diagnosis')(diagnosisValues.diagnosis);
        navigation.goBack();
    };

    return (
        <Formik
            initialValues={values}
            validationSchema={validationSchema}
            onSubmit={handleSaveDiagnosis}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.formContainer}>
                    <View style={styles.formGroup}>
                        <Text>Diagnosis</Text>
                        <FeTextInput
                            placeholder="optional"
                            error={touched.diagnosis && errors.diagnosis}
                            onChangeText={handleChange('diagnosis')}
                            onBlur={handleBlur('diagnosis')}
                            value={values.diagnosis}
                            type={'list'}
                            multiline={true}
                            numberOfLines={4}
                            style={styles.textArea}
                        />
                        {touched.diagnosis && errors.diagnosis && <Text style={styles.error}>{errors.diagnosis}</Text>}
                    </View>
                    <FeButton severity={'primary'} onPress={handleSubmit as any} title="Save Diagnosis" />
                </View>
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
    formGroup: {
        backgroundColor: 'white',
        paddingVertical: appStyle.spacing.m,
        paddingHorizontal: appStyle.spacing.m,
        borderRadius: appStyle.radius.s
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    error: {
        color: 'red',
        marginBottom: 8,
    },
});

export default DiagnosisForm;
