import {NativeStackScreenProps} from "@react-navigation/native-stack";

export interface PatientValues {
    firstName: string;
    lastName: string;
    diagnosis?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    birthNumber: string;
    doctorId: string;
    photo?: string;
}


export enum Routes {
    AddDoctor = 'AddDoctor',
    AddPatient = 'AddPatient',
    AdminDashboard = 'AdminDashboard',
    DoctorDashboard = 'DoctorDashboard',
    EditDoctor = 'EditDoctor',
    EditPatient = 'EditPatient',
    LoginScreen = 'LoginScreen',
    RegisterScreen = 'RegisterScreen',
    InitialScreen = 'InitialScreen',
    AddressForm = 'AddressForm',
    DiagnosisForm = 'DiagnosisForm',
    GalleryScreen = 'GalleryScreen',
}

export type RootStackParamList = {
    [Routes.AddDoctor]: {

    };
    [Routes.AddPatient]: {
        doctorId: string,
    };
    [Routes.AdminDashboard]: {

    };
    [Routes.DoctorDashboard]: {
        doctorId: string,

    };
    [Routes.EditDoctor]: {
        doctorId: string;
    };
    [Routes.EditPatient]: {
        patientId: string;
    };
    [Routes.LoginScreen]: {

    };
    [Routes.RegisterScreen]: {

    };
    [Routes.InitialScreen]: {

    };
    [Routes.AddressForm]: {
        values: PatientValues
        handleChange: any,
    };
    [Routes.DiagnosisForm]: {
        values: PatientValues
        handleChange: any,
    };
    [Routes.GalleryScreen]: {

    };
};

export type AddDoctorProps = NativeStackScreenProps<
    RootStackParamList,
    Routes.AddDoctor
>;

export type AddPatientProps = NativeStackScreenProps<
    RootStackParamList,
    Routes.AddPatient
>;

export type AdminDashboardProps = NativeStackScreenProps<
    RootStackParamList,
    Routes.AdminDashboard
>;

export type DoctorDashboardProps = NativeStackScreenProps<
    RootStackParamList,
    Routes.DoctorDashboard
>;

export type EditDoctorProps = NativeStackScreenProps<
    RootStackParamList,
    Routes.EditDoctor
>;

export type EditPatientProps = NativeStackScreenProps<
    RootStackParamList,
    Routes.EditPatient
>;

export type LoginScreenProps = NativeStackScreenProps<
    RootStackParamList,
    Routes.LoginScreen
>;

export type RegisterScreenProps = NativeStackScreenProps<
    RootStackParamList,
    Routes.RegisterScreen
>;

export type InitialScreenProps = NativeStackScreenProps<
    RootStackParamList,
    Routes.InitialScreen
>;

export type AddressFormProps = NativeStackScreenProps<
    RootStackParamList,
    Routes.AddressForm
>;

export type DiagnosisFormProps = NativeStackScreenProps<
    RootStackParamList,
    Routes.DiagnosisForm
>;

export type GalleryScreenProps = NativeStackScreenProps<
    RootStackParamList,
    Routes.GalleryScreen
>;

