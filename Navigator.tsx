import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddDoctor from "./src/screens/AddDoctor";
import { RootStackParamList, Routes } from "./src/types";
import AddPatient from "./src/screens/AddPatient";
import AdminDashboard from "./src/screens/AdminDashboard";
import DoctorDashboard from "./src/screens/DoctorDashboard";
import EditDoctor from "./src/screens/EditDoctor";
import EditPatient from "./src/screens/EditPatient";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import { AuthContext, AuthProvider } from "./src/context/AuthContext";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import InitialScreen from "./src/screens/InitialScreen";
import AddressForm from "./src/forms/AddressForm";
import DiagnosisForm from "./src/forms/DiagnosisForm";
import GalleryScreen from "./src/screens/GalleryScreen";
import {appStyle} from "./src/theme/AppStyle";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const { user } = useContext(AuthContext);

    // if (user === null) {
    //     return (
    //         <View style={styles.loadingContainer}>
    //             <ActivityIndicator size="large" />
    //         </View>
    //     );
    // }
    // <Stack.Navigator  screenOptions={{
    //     contentStyle:{
    //         backgroundColor:'#FFFFFF'
    //     }
    // }}  initialRouteName="Home">
    return (
        <NavigationContainer>
            {/*<Stack.Navigator initialRouteName={user ? (user.role === 'admin' ? Routes.AdminDashboard : Routes.DoctorDashboard) : Routes.LoginScreen}>*/}
            <Stack.Navigator initialRouteName={Routes.InitialScreen} screenOptions={{contentStyle: {backgroundColor: appStyle.colors.background.brand_2}}}>
                <Stack.Screen name={Routes.InitialScreen} component={InitialScreen} />
                {/*<Stack.Screen name={Routes.LoginScreen} component={LoginScreen} />*/}
                <Stack.Screen name={Routes.RegisterScreen} component={RegisterScreen} />
                <Stack.Screen name={Routes.AddressForm} component={AddressForm} />
                <Stack.Screen name={Routes.DiagnosisForm} component={DiagnosisForm} />
                <Stack.Screen name={Routes.AddDoctor} component={AddDoctor} />
                <Stack.Screen name={Routes.AddPatient} component={AddPatient} />
                <Stack.Screen name={Routes.AdminDashboard} component={AdminDashboard} />
                <Stack.Screen name={Routes.DoctorDashboard} component={DoctorDashboard} />
                <Stack.Screen name={Routes.EditDoctor} component={EditDoctor} />
                <Stack.Screen name={Routes.EditPatient} component={EditPatient} />
                <Stack.Screen name={Routes.GalleryScreen} component={GalleryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const Navigator = () => {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
};

export default Navigator;
