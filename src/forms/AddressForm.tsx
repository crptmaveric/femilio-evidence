import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FeTextInput from "../components/FeTextInput";
import FeButton from "../components/FeButton";
import { appStyle } from "../theme/AppStyle";
import { Divider, ListItem } from "react-native-elements";
import CustomHeader from '../components/CustomHeader';

const AddressForm = ({ navigation, route }) => {
    const { values, handleChange } = route.params;

    const validationSchema = Yup.object().shape({
        street: Yup.string().optional(),
        city: Yup.string().optional(),
        postalCode: Yup.string().optional(),
        country: Yup.string().optional()
    });

    const handleSaveAddress = async (addressValues) => {
        handleChange('street')(addressValues.street);
        handleChange('city')(addressValues.city);
        handleChange('postalCode')(addressValues.postalCode);
        handleChange('country')(addressValues.country);
        navigation.goBack();
    };

    const handleCancel = (dirty) => {
        navigation.goBack();
    };

    return (
        <Formik
            initialValues={values}
            validationSchema={validationSchema}
            onSubmit={handleSaveAddress}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, dirty }) => {
                useEffect(() => {
                    navigation.setOptions({
                        headerTransparent: true,
                        header: () => (
                            <SafeAreaView style={{ flex: 1 }}>
                                <CustomHeader
                                    cancelTitle="Back"
                                    showBack={true}
                                    title="Address"
                                    onCancel={handleSubmit}
                                    isModified={dirty}
                                />
                            </SafeAreaView>
                        ),
                    });
                }, [navigation, handleSubmit]);

                return (
                    <SafeAreaView style={{ flex: 1}}>
                        <View style={styles.formContainer}>
                            <View style={styles.formGroup}>
                                <ListItem containerStyle={styles.listItem}>
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
                                <Divider color={appStyle.colors.primary['100']} width={1} />
                                <ListItem containerStyle={styles.listItem}>
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
                                <Divider color={appStyle.colors.primary['100']} width={1} />
                                <ListItem containerStyle={styles.listItem}>
                                    <ListItem.Content>
                                        <ListItem.Title>Postal Code</ListItem.Title>
                                    </ListItem.Content>
                                    <FeTextInput
                                        placeholder="required"
                                        numberInput={true}
                                        error={touched.postalCode && errors.postalCode}
                                        onChangeText={handleChange('postalCode')}
                                        onBlur={handleBlur('postalCode')}
                                        value={values.postalCode}
                                        type={'list'}
                                    />
                                </ListItem>
                                <Divider color={appStyle.colors.primary['100']} width={1} />
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
                        </View>
                    </SafeAreaView>
                );
            }}
        </Formik>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        gap: appStyle.spacing.m,
        justifyContent: 'flex-start',
        padding: 16,
        marginTop: 48,
    },
    formGroup: {
        backgroundColor: 'white',
        borderRadius: appStyle.radius.s,
        paddingHorizontal: appStyle.spacing.s,
    },
    error: {
        color: 'red',
        marginBottom: 8,
    },
    listItem: {}
});

export default AddressForm;
