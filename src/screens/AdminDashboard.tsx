import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Button, FlatList, Text, StyleSheet, Alert } from 'react-native';
import { getDatabaseConnection, deleteDatabase } from '../database';
import { AdminDashboardProps, Routes } from "../types";
import { Icon, ListItem } from "react-native-elements";
import { FeTextAvatar } from "../components/FeTextAvatar";
import FeButton from "../components/FeButton";
import { appStyle } from "../theme/AppStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminDashboard = ({ navigation }: AdminDashboardProps) => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            const db = await getDatabaseConnection();
            const results = await db.executeSql('SELECT * FROM Users WHERE role = ?', ['doctor']);
            setDoctors(results[0].rows.raw());
        };

        fetchDoctors();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Icon
                    name="refresh"
                    type="ionicon"
                    onPress={handleResetDatabase}
                    color={appStyle.colors.primary['400']}
                    size={30}
                />
            )
        });
    }, [navigation]);

    const handleResetDatabase = () => {
        Alert.alert(
            "Reset Database",
            "Are you sure you want to reset the database? This will delete all data.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        await deleteDatabase();
                        await AsyncStorage.clear();
                        setDoctors([]);
                        Alert.alert("Database reset successfully");
                    }
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={doctors}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ListItem
                        bottomDivider
                        key={item.id}
                        containerStyle={styles.listItem}
                        onPress={() => {
                            navigation.navigate(Routes.EditDoctor, { doctorId: item.id })
                        }}>
                        <FeTextAvatar name={`${item.firstName} ${item.lastName}`} />
                        <ListItem.Content>
                            <ListItem.Title>{`${item.firstName} ${item.lastName}`}</ListItem.Title>
                            <ListItem.Subtitle style={styles.listItemSubtitle}>
                                {item.email}
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
                                    style={{ marginLeft: appStyle.spacing.s }}
                                    size={17}
                                />
                            }
                            iconPosition={'right'}
                            onPress={() => {
                                navigation.navigate(Routes.EditDoctor, { doctorId: item.id })
                            }}
                        />
                    </ListItem>
                )}
            />
            <Button title="Add Doctor" onPress={() => navigation.navigate(Routes.AddDoctor)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    listItem: {},
    listItemSubtitle: {
        color: appStyle.colors.labels.secondary,
    },
});

export default AdminDashboard;
