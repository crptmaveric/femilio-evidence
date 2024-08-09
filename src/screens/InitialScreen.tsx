import React, { useState, useEffect, useCallback } from 'react';
import {View, StyleSheet, Alert, SafeAreaView, ScrollView, TouchableOpacity, Text} from 'react-native';
import { getDatabaseConnection } from '../database';
import { InitialScreenProps, Routes } from "../types";
import { FeTextAvatar } from "../components/FeTextAvatar";
import FeButton from "../components/FeButton";
import {Card} from "react-native-elements";
import {appStyle} from "../theme/AppStyle";

const InitialScreen = ({ navigation }: InitialScreenProps) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
            title: 'Accounts'
        });
    }, [navigation]);

    useEffect(() => {
        const fetchUsers = async () => {
            const db = await getDatabaseConnection();
            const results = await db.executeSql('SELECT * FROM Users');
            if (results.length > 0 && results[0].rows) {
                setUsers(results[0].rows.raw());
            }
        };

        fetchUsers();
    }, []);

    const handleSelectUser = (userId) => {
        setSelectedUser(userId);
    };

    const handleProceed = () => {
        if (selectedUser) {
            const user = users.find(user => user.id == selectedUser);

            if (user) {
                if (user.role === 'admin') {
                    navigation.navigate(Routes.AdminDashboard);
                } else if (user.role === 'doctor') {
                    navigation.navigate(Routes.DoctorDashboard, { doctorId: user.id });
                } else {
                    Alert.alert("Invalid role");
                }
            }
        } else {
            Alert.alert("Please select a user");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.headlineContainer}>
                    <Text style={styles.headlineText}>Please select a user</Text>
                </View>
                {users.map(user => (
                    <TouchableOpacity key={user.id} onPress={() => handleSelectUser(user.id)}>
                        <Card containerStyle={[styles.card, selectedUser === user.id && styles.selectedCard]}>
                            <View style={styles.avatarContainer}>
                            <FeTextAvatar
                                name={`${user.firstName} ${user.lastName}`}
                                size={'large'}
                                rounded
                                containerStyle={styles.avatar}
                            />
                            </View>
                            <View style={styles.titleContainer}>
                                <Card.Title>{`${user.firstName} ${user.lastName}`}</Card.Title>
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.actionContainer}>
                <FeButton
                    severity={'primary'}
                    title="Proceed"
                    onPress={handleProceed}
                    disabled={!selectedUser}  // Disable button if no user is selected
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    scrollView: {
        width: '100%',
    },
    headlineContainer: {
        margin: 16,
        alignItems: 'center'
    },
    headlineText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    card: {
        marginBottom: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    selectedCard: {
        borderWidth: 2,
        borderColor: appStyle.colors.primary["400"]
    },
    avatar: {
    },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: appStyle.spacing.m,
    },
    titleContainer: {
        alignItems: 'center'
    },
    actionContainer: {
        paddingHorizontal: 16,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        width: '100%',
    }
});

export default InitialScreen;
