import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {View, FlatList, StyleSheet, SafeAreaView, Text} from 'react-native';
import {getDatabaseConnection} from '../database';
import FeButton from '../components/FeButton';
import {Icon, ListItem, Avatar, Divider} from 'react-native-elements';
import {FeTextAvatar} from '../components/FeTextAvatar';
import {appStyle} from '../theme/AppStyle';
import {Pressable} from "native-base";
import {useFocusEffect} from '@react-navigation/native';
import {DoctorDashboardProps, Routes} from "../types";
import MMKVStorage from "react-native-mmkv-storage";

const MMKV = new MMKVStorage.Loader().initialize();

const DoctorDashboard = ({navigation, route}: DoctorDashboardProps) => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const setNavigationOptions = useCallback(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitleStyle: {
                color: 'black'
            },
            headerTintColor: appStyle.colors.primary['400'],
            title: 'Patients',
            headerSearchBarOptions: {
                placeholder: 'Search name...',
                onChangeText: event => {
                    const query = event.nativeEvent.text;
                    setSearchQuery(query);
                },
                barTintColor: appStyle.colors.background.brand_2,  // Background color of the search bar
                tintColor: appStyle.colors.primary['400'],         // Text color
            },
            headerLargeTitle: true,
            headerRight: () => (
                <FeButton severity={"tertiary"}
                          onPress={() => navigation.navigate(Routes.AddPatient, {doctorId: route.params.doctorId})}
                          title={'Add Patient'}
                          icon={
                              <Icon name={'add-circle-outline'} type={'ionicon'} style={{marginRight: 4}}
                                    color={appStyle.colors.primary['400']}/>}/>
            ),
        });
    }, [navigation]);

    useLayoutEffect(() => {
        setNavigationOptions();
    }, [setNavigationOptions]);

    const fetchPatients = async () => {
        const db = await getDatabaseConnection();
        const results = await db.executeSql('SELECT * FROM Patients');
        let patients = results[0].rows.raw();
        patients = patients.sort((a, b) => a.lastName.localeCompare(b.lastName));

        patients = patients.map(patient => ({
            ...patient,
            photo: patient.photo ? MMKV.getString(patient.photo) : null // Retrieve the base64 string from MMKV
        }));

        setPatients(patients);
        setFilteredPatients(patients);
    };

    useFocusEffect(
        useCallback(() => {
            fetchPatients();
        }, [])
    );

    useEffect(() => {
        filterPatients(searchQuery);
    }, [searchQuery, patients]);

    const filterPatients = (query) => {
        if (query) {
            const filtered = patients.filter(patient => {
                const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
                return fullName.includes(query.toLowerCase());
            });
            setFilteredPatients(filtered);
        } else {
            setFilteredPatients(patients);
        }
    };

    const groupPatientsByLastName = (patients) => {
        const groupedPatients = patients.reduce((groups, patient) => {
            const letter = patient.lastName[0].toUpperCase();
            if (!groups[letter]) {
                groups[letter] = [];
            }
            groups[letter].push(patient);
            return groups;
        }, {});

        return Object.keys(groupedPatients).sort().map(letter => ({
            letter,
            data: groupedPatients[letter]
        }));
    };

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <FlatList
                    data={groupPatientsByLastName(filteredPatients)}
                    keyExtractor={(item) => item.letter}
                    renderItem={({item}) => (
                        <View>
                            <ListItem style={styles.groupHeaderContainer} containerStyle={{backgroundColor: 'transparent'}}>
                                <Text style={styles.groupHeader}>{item.letter}</Text>
                            </ListItem>
                            {/*<Divider style={styles.customDivider} color={appStyle.colors.primary['200']} width={1} />*/}
                            {item.data.map(patient => (
                                <ListItem
                                    key={patient.id}
                                    containerStyle={[styles.listItem]}
                                    onPress={() => navigation.navigate(Routes.EditPatient, {patientId: patient.id})}
                                >
                                    {patient.photo ? (
                                        <Avatar
                                            rounded
                                            source={{ uri: `data:image/jpeg;base64,${patient.photo}` }}
                                            title={patient.firstName[0] + patient.lastName[0]}
                                            size="medium"
                                        />
                                    ) : (
                                        <FeTextAvatar name={patient.firstName + " " + patient.lastName}/>
                                    )}
                                    <ListItem.Content>
                                        <ListItem.Title>{patient.firstName + " " + patient.lastName}</ListItem.Title>
                                        <ListItem.Subtitle style={styles.listItemSubtitle}>
                                            {patient.birthNumber}
                                        </ListItem.Subtitle>
                                    </ListItem.Content>
                                    <FeButton
                                        severity={'tertiary'}
                                        title={''}
                                        icon={
                                            <Icon
                                                name={'chevron-forward-outline'}
                                                type={'ionicon'}
                                                color={appStyle.colors.primary['400']}
                                                style={{marginLeft: appStyle.spacing.s}}
                                                size={17}
                                            />
                                        }
                                        iconPosition={'right'}
                                        onPress={() => navigation.navigate(Routes.EditPatient, {patientId: patient.id})}
                                    />
                                </ListItem>
                            ))}

                        </View>
                    )}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listItem: {
        backgroundColor: appStyle.colors.background.brand_2
    },
    listItemSubtitle: {
        color: appStyle.colors.labels.secondary,
    },
    groupHeaderContainer: {
        padding: 0,
        margin: 0,
    },
    groupHeader: {
        paddingTop: appStyle.spacing.m,
        paddingBottom: 0,
        marginBottom : 0,
        paddingLeft: appStyle.spacing.m,
        color: 'black',
        fontWeight: 'bold',
    },
    customDivider: {
        // height: 40,
        // backgroundColor: 'white',
        // borderColor: 'transparent',
    }
});

export default DoctorDashboard;
