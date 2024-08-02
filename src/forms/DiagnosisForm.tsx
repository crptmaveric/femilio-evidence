import React, {useEffect} from 'react';
import {View, StyleSheet, Alert, SafeAreaView} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FeTextInput from "../components/FeTextInput";
import FeButton from "../components/FeButton";
import { appStyle } from "../theme/AppStyle";
import { ListItem } from "react-native-elements";
import CustomHeader from '../components/CustomHeader';
import {Text} from "native-base"; // Pridanie importu pre vlastnú hlavičku

const DiagnosisForm = ({ navigation, route }) => {
    const { values, handleChange } = route.params;

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const validationSchema = Yup.object().shape({
        diagnosis: Yup.string().optional(),
    });

    const handleSaveDiagnosis = async (diagnosisValues) => {
        handleChange('diagnosis')(diagnosisValues.diagnosis);
        navigation.goBack();
    };

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

    return (
        <Formik
            initialValues={values}
            validationSchema={validationSchema}
            onSubmit={handleSaveDiagnosis}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, dirty }) => (
                <SafeAreaView style={{flex: 1}}>
                    <CustomHeader
                        cancelTitle={'Back'}
                        title="Diagnosis"
                        onCancel={handleSubmit}
                        isModified={dirty}
                    />
                    <View style={styles.formContainer}>
                        <Text style={styles.heading}>Diagnosis</Text>
                        <View style={styles.formGroup}>
                            <FeTextInput
                                placeholder="optional"
                                error={touched.diagnosis && errors.diagnosis}
                                onChangeText={handleChange('diagnosis')}
                                onBlur={handleBlur('diagnosis')}
                                value={values.diagnosis}
                                type={'list'}
                                multiline={true}
                                style={styles.textArea}
                            />
                            {touched.diagnosis && errors.diagnosis && <Text style={styles.error}>{errors.diagnosis}</Text>}
                        </View>
                    </View>
                </SafeAreaView>
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
        borderRadius: appStyle.radius.s
    },
    textArea: {
        height: 400,
        textAlignVertical: 'top',
    },
    labelDiagnosis: {

    },
    error: {
        color: 'red',
        marginBottom: 8,
    },
    heading: {
        // marginBottom: appStyle.spacing.s,
        fontSize: 15,
        color: appStyle.colors.labels.secondary,
        textTransform: 'uppercase',
    }
});

export default DiagnosisForm;
