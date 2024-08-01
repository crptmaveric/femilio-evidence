import React, {useEffect} from 'react';
import {View, StyleSheet, Alert, SafeAreaView} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FeTextInput from "../components/FeTextInput";
import FeButton from "../components/FeButton";
import { appStyle } from "../theme/AppStyle";
import { ListItem } from "react-native-elements";
import CustomHeader from '../components/CustomHeader'; // Pridanie importu pre vlastnú hlavičku

const AddressForm = ({ navigation, route }) => {
    const { values, handleChange } = route.params;

    const validationSchema = Yup.object().shape({
        street: Yup.string().optional(),
        city: Yup.string().optional(),
        postalCode: Yup.string().optional(),
        country: Yup.string().optional()
    });

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const handleSaveAddress = async (addressValues) => {
        handleChange('street')(addressValues.street);
        handleChange('city')(addressValues.city);
        handleChange('postalCode')(addressValues.postalCode);
        handleChange('country')(addressValues.country);
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
            onSubmit={handleSaveAddress}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, dirty }) => (
               <SafeAreaView style={{flex: 1}}>
                   <CustomHeader
                       cancelTitle={'Back'}
                       saveTitle={'Update'}
                       title="Edit Address"
                       onCancel={() => handleCancel(dirty)}
                       onSave={handleSubmit}
                       isModified={dirty}
                       actionSeverity={'secondary'}
                   />
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
    error: {
        color: 'red',
        marginBottom: 8,
    },
    listItem: {}
});

export default AddressForm;
