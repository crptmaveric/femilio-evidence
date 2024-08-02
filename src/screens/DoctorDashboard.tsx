import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {View, FlatList, StyleSheet, SafeAreaView, Text} from 'react-native';
import {getDatabaseConnection} from '../database';
import FeButton from '../components/FeButton';
import {Icon, ListItem, Avatar} from 'react-native-elements';
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
            title: 'Patients',
            headerSearchBarOptions: {
                placeholder: 'Search name...',
                onChangeText: event => {
                    const query = event.nativeEvent.text;
                    setSearchQuery(query);
                },
            },
            headerLargeTitle: true,
            headerRight: () => (
                <Pressable
                    paddingY={3}
                    paddingLeft={6}
                    onPress={() => navigation.navigate(Routes.AddPatient, {doctorId: route.params.doctorId})}>
                    <Icon name={'information-circle-outline'} type={'ionicon'} color={appStyle.colors.primary['400']}/>
                </Pressable>
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
                            <ListItem bottomDivider style={styles.groupHeaderContainer}>
                                <Text style={styles.groupHeader}>{item.letter}</Text>
                            </ListItem>
                            {item.data.map(patient => (
                                <ListItem
                                    bottomDivider
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
                                                name={'add-circle-outline'}
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
    listItem: {},
    listItemSubtitle: {
        color: appStyle.colors.labels.secondary,
    },
    groupHeaderContainer: {
        padding: 0,
        margin: 0,
    },
    groupHeader: {
        paddingTop: appStyle.spacing.s,
        paddingBottom: 0,
        marginBottom : 0,
        paddingLeft: appStyle.spacing.m,
        color: appStyle.colors.labels.secondary,
        fontWeight: 'bold',
    },
});

export default DoctorDashboard;
