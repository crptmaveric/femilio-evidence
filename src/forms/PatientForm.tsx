import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {FormikProps} from 'formik';
import {ListItem, Avatar} from 'react-native-elements';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {appStyle} from "../theme/AppStyle";
import {Routes} from "../types";
import FeTextInput from "../components/FeTextInput";
import FeButton from "../components/FeButton";
import {ScrollView} from "native-base";
import {saveImage} from "../utils/patientHelpers";
import MMKVStorage from "react-native-mmkv-storage";

export interface PatientFormProps extends FormikProps<any> {
    navigation: any;
}

const MMKV = new MMKVStorage.Loader().initialize();

const PatientForm: React.FC<PatientFormProps> = ({
                                                     handleChange,
                                                     handleBlur,
                                                     handleSubmit,
                                                     values,
                                                     errors,
                                                     touched,
                                                     navigation
                                                 }) => {
    const [photoUri, setPhotoUri] = React.useState<string | null>(null);


    useEffect(() => {
        if (values.photo) {
            const base64Image = MMKV.getString(values.photo);
            setPhotoUri(`data:image/jpeg;base64,${base64Image}`);
        }
    }, [values.photo]);

    const handleChoosePhoto = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1, includeBase64: true }, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                const base64Image = response.assets ? response.assets[0].base64 : null;
                if (base64Image) {
                    const imageKey = await saveImage(base64Image);
                    if (imageKey) {
                        handleChange('photo')(imageKey);
                        setPhotoUri(`data:image/jpeg;base64,${base64Image}`);
                    }
                }
            }
        });
    };

    const handleTakePhoto = () => {
        launchCamera({ mediaType: 'photo', quality: 1, includeBase64: true }, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
            } else {
                const base64Image = response.assets ? response.assets[0].base64 : null;
                if (base64Image) {
                    const imageKey = await saveImage(base64Image);
                    if (imageKey) {
                        handleChange('photo')(imageKey);
                        setPhotoUri(`data:image/jpeg;base64,${base64Image}`);
                    }
                }
            }
        });
    };

    return (
        <ScrollView>
            <View style={styles.formContainer}>
                <View style={styles.avatarContainer}>
                    {photoUri ?
                        <Avatar size={'xlarge'} rounded={true}
                                source={{uri: photoUri}}
                        />
                        :
                        <Avatar size={'xlarge'} rounded={true}
                                containerStyle={{backgroundColor: appStyle.colors.primary[50]}}/>}

                    <FeButton title="Choose Photo" onPress={handleChoosePhoto} severity="secondary"/>
                    <FeButton title="Take Photo" onPress={handleTakePhoto} severity="secondary"/>
                </View>
                <View style={styles.formGroup}>
                    <ListItem bottomDivider containerStyle={styles.listItem}>
                        <ListItem.Content>
                            <ListItem.Title>First name</ListItem.Title>
                        </ListItem.Content>
                        <FeTextInput
                            placeholder="required"
                            error={touched.firstName && errors.firstName}
                            onChangeText={handleChange('firstName')}
                            onBlur={handleBlur('firstName')}
                            value={values.firstName}
                            type={'list'}
                        />
                    </ListItem>
                    <ListItem bottomDivider containerStyle={styles.listItem}>
                        <ListItem.Content>
                            <ListItem.Title>Last name</ListItem.Title>
                        </ListItem.Content>
                        <FeTextInput
                            placeholder="required"
                            error={touched.lastName && errors.lastName}
                            onChangeText={handleChange('lastName')}
                            onBlur={handleBlur('lastName')}
                            value={values.lastName}
                            type={'list'}
                        />
                    </ListItem>
                    <ListItem containerStyle={styles.listItem}>
                        <ListItem.Content>
                            <ListItem.Title>Birth Number</ListItem.Title>
                        </ListItem.Content>
                        <FeTextInput
                            placeholder="required"
                            error={touched.birthNumber && errors.birthNumber}
                            onChangeText={handleChange('birthNumber')}
                            onBlur={handleBlur('birthNumber')}
                            value={values.birthNumber}
                            type={'list'}
                        />
                    </ListItem>
                    {/*<ListItem containerStyle={styles.listItem}>*/}
                    {/*    <ListItem.Content>*/}
                    {/*        <ListItem.Title>Profile Photo</ListItem.Title>*/}
                    {/*    </ListItem.Content>*/}
                    {/*    <FeButton title="Choose Photo" onPress={handleChoosePhoto} severity="secondary"/>*/}
                    {/*    <FeButton title="Take Photo" onPress={handleTakePhoto} severity="secondary"/>*/}
                    {/*    {photoUri && <Image source={{uri: photoUri}} style={styles.photo}/>}*/}
                    {/*</ListItem>*/}
                </View>
                <View style={styles.formGroup}>
                    <ListItem containerStyle={styles.listItem}
                              onPress={() => navigation.navigate(Routes.AddressForm, {values, handleChange})}>
                        <ListItem.Content style={styles.listItemContent}>
                            <ListItem.Title style={styles.listItemTitle}>Address</ListItem.Title>
                            <ListItem.Subtitle style={styles.listItemSubtitle}>
                                {values.street || values.city || values.postalCode || values.country ? `${values.street}, ${values.city}, ${values.postalCode}, ${values.country}` : ''}
                            </ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron/>
                    </ListItem>
                </View>
                <View style={styles.formGroup}>
                    <ListItem containerStyle={styles.listItem}
                              onPress={() => navigation.navigate(Routes.DiagnosisForm, {values, handleChange})}>
                        <ListItem.Content style={styles.listItemContent}>
                            <ListItem.Title style={styles.listItemTitle}>Diagnosis</ListItem.Title>
                            <ListItem.Subtitle style={styles.listItemSubtitle}>{values.diagnosis}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron/>
                    </ListItem>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        gap: appStyle.spacing.m,
        justifyContent: 'flex-start',
        padding: 16,
    },
    avatarContainer: {
        alignItems: 'center',
        gap: appStyle.spacing.m,
    },
    formGroup: {
        backgroundColor: 'white',
        paddingVertical: appStyle.spacing.s,
        paddingHorizontal: appStyle.spacing.s,
        borderRadius: appStyle.radius.s
    },
    error: {
        color: 'red',
        marginBottom: 8,
    },
    listItem: {
        paddingVertical: appStyle.spacing.s,
    },
    listItemContent: {},
    listItemTitle: {},
    listItemSubtitle: {
        color: appStyle.colors.labels.secondary,
    },
    // photo: {
    //     width: 100,
    //     height: 100,
    //     borderRadius: 50,
    //     marginTop: appStyle.spacing.s,
    // },
});

export default PatientForm;
