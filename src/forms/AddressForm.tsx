import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FeTextInput from "../components/FeTextInput";
import FeButton from "../components/FeButton";
import { appStyle } from "../theme/AppStyle";
import { ListItem } from "react-native-elements";

const AddressForm = ({ navigation, route }) => {
    const { values, handleChange } = route.params;

    const validationSchema = Yup.object().shape({
        street: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        postalCode: Yup.string().required('Required'),
        country: Yup.string().required('Required')
    });

    const handleSaveAddress = async (addressValues) => {
        handleChange('street')(addressValues.street);
        handleChange('city')(addressValues.city);
        handleChange('postalCode')(addressValues.postalCode);
        handleChange('country')(addressValues.country);
        navigation.goBack();
    };

    return (
        <Formik
            initialValues={values}
            validationSchema={validationSchema}
            onSubmit={handleSaveAddress}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.formContainer}>
                    <View style={styles.formGroup}>
                        <ListItem bottomDivider containerStyle={styles.listItem}>
                            <ListItem.Content>
                                <ListItem.Title>Street</ListItem.Title>
                            </ListItem.Content>
                            <FeTextInput
                                placeholder="required"
                                error={touched.street && errors.street}
                                onChangeText={handleChange('street')}
                                onBlur={handleBlur('street')}
                                value={values.street}
                                type={'list'}
                            />
                        </ListItem>
                        <ListItem bottomDivider containerStyle={styles.listItem}>
                            <ListItem.Content>
                                <ListItem.Title>City</ListItem.Title>
                            </ListItem.Content>
                            <FeTextInput
                                placeholder="required"
                                error={touched.city && errors.city}
                                onChangeText={handleChange('city')}
                                onBlur={handleBlur('city')}
                                value={values.city}
                                type={'list'}
                            />
                        </ListItem>
                        <ListItem bottomDivider containerStyle={styles.listItem}>
                            <ListItem.Content>
                                <ListItem.Title>Postal Code</ListItem.Title>
                            </ListItem.Content>
                            <FeTextInput
                                placeholder="required"
                                error={touched.postalCode && errors.postalCode}
                                onChangeText={handleChange('postalCode')}
                                onBlur={handleBlur('postalCode')}
                                value={values.postalCode}
                                type={'list'}
                            />
                        </ListItem>
                        <ListItem containerStyle={styles.listItem}>
                            <ListItem.Content>
                                <ListItem.Title>Country</ListItem.Title>
                            </ListItem.Content>
                            <FeTextInput
                                placeholder="required"
                                error={touched.country && errors.country}
                                onChangeText={handleChange('country')}
                                onBlur={handleBlur('country')}
                                value={values.country}
                                type={'list'}
                            />
                        </ListItem>
                    </View>
                    <FeButton severity={'primary'} onPress={handleSubmit as any} title="Save Address" />
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
        borderRadius: appStyle.radius.s
    },
    error: {
        color: 'red',
        marginBottom: 8,
    },
    listItem: {}
});

export default AddressForm;
