import 'react-native-gesture-handler';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import AddDoctor from './src/screens/AddDoctor';
import EditDoctor from './src/screens/EditDoctor';
import DoctorDashboard from './src/screens/DoctorDashboard';
import AddPatient from './src/screens/AddPatient';
import EditPatient from './src/screens/EditPatient';
import { extendTheme, NativeBaseProvider } from 'native-base';
import { appStyle } from './src/theme/AppStyle';
import {RootStackParamList} from "./src/types";
import Navigator from "./Navigator";


const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function AuthStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

function AdminTabs() {
    return (
        <Tab.Navigator>
            {/*<Tab.Screen name="Doctors" component={AdminDashboard} />*/}
            <Stack.Screen name="Patients" component={DoctorDashboard} />
        </Tab.Navigator>
    );
}

function DoctorTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Patients" component={DoctorDashboard} />
        </Tab.Navigator>
    );
}

function AdminStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Patients" component={DoctorDashboard}/>
            {/*<Stack.Screen name="AddDoctor" component={AddDoctor} />*/}
            {/*<Stack.Screen name="EditDoctor" component={EditDoctor} />*/}
            <Stack.Screen name="AddPatient" component={AddPatient} />
            <Stack.Screen name="EditPatient" component={EditPatient} />
        </Stack.Navigator>
    );
}

function DoctorStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="DoctorTabs" component={DoctorTabs} options={{ headerShown: false }} />
            <Stack.Screen name="AddPatient" component={AddPatient} />
            <Stack.Screen name="EditPatient" component={EditPatient} />
        </Stack.Navigator>
    );
}

export default function App() {
    const { user } = useContext(AuthContext);

    const appTheme = extendTheme({
        colors: {
            primary: appStyle.colors.primary,
            danger: appStyle.colors.danger,
        },
        fontConfig: {
            SF: {
                100: {
                    normal: 'SF-Pro-Text-UltraLight',
                    italic: 'SF-Pro-Text-UltraLightItalic',
                },
                200: {
                    normal: 'SF-Pro-Text-Thin',
                    italic: 'SF-Pro-Text-ThinItalic',
                },
                300: {
                    normal: 'SF-Pro-Text-Light',
                    italic: 'SF-Pro-Text-LightItalic',
                },
                400: {
                    normal: 'SF-Pro-Text-Regular',
                    italic: 'SF-Pro-Text-RegularItalic',
                },
                500: {
                    normal: 'SF-Pro-Text-SemiBold',
                    italic: 'SF-Pro-Text-SemiBoldItalic',
                },
                600: {
                    normal: 'SF-Pro-Text-SemiBold',
                    italic: 'SF-Pro-Text-SemiBoldItalic',
                },
                700: {
                    normal: 'SF-Pro-Text-Bold',
                    italic: 'SF-Pro-Text-BoldItalic',
                },
                800: {
                    normal: 'SF-Pro-Text-Heavy',
                    italic: 'SF-Pro-Text-HeavyItalic',
                },
                900: {
                    normal: 'SF-Pro-Text-Black',
                    italic: 'SF-Pro-Text-BlackItalic',
                },
            },
            Alkaline: {
                100: {
                    normal: 'alkaline-medium',
                    italic: 'alkaline-medium',
                },
                200: {
                    normal: 'alkaline-medium',
                    italic: 'alkaline-medium',
                },
                300: {
                    normal: 'alkaline-medium',
                    italic: 'alkaline-medium',
                },
                400: {
                    normal: 'alkaline-regular',
                    italic: 'alkaline-regular',
                },
                500: {
                    normal: 'alkaline-regular',
                    italic: 'alkaline-regular',
                },
                600: {
                    normal: 'alkaline-regular',
                    italic: 'alkaline-regular',
                },
                700: {
                    normal: 'alkaline-bold',
                    italic: 'alkaline-bold',
                },
                800: {
                    normal: 'alkaline-heavy',
                    italic: 'alkaline-heavy',
                },
                900: {
                    normal: 'alkaline-heavy',
                    italic: 'alkaline-heavy',
                },
            }
        },
        fonts: {
            heading: 'SF',
            body: 'SF',
            mono: 'SF',
        },
    });

    return (
        <NativeBaseProvider theme={appTheme}>
            <Navigator/>
        </NativeBaseProvider>
    );
}
