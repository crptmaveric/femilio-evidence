import React, {useState, useEffect} from 'react';
import {View, Button, StyleSheet, Alert, SafeAreaView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {getDatabaseConnection} from '../database';
import {InitialScreenProps, Routes} from "../types";

const InitialScreen = ({navigation}: InitialScreenProps) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

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

    const handleSelectUser = () => {
        if (selectedUser) {
            const user = users.find(user => user.id == selectedUser);

            if (user) {
                if (user.role === 'admin') {
                    navigation.navigate(Routes.AdminDashboard);
                } else if (user.role === 'doctor') {
                    navigation.navigate(Routes.DoctorDashboard, {doctorId: user.id});
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
            <Picker
                selectedValue={selectedUser}
                onValueChange={(itemValue) => setSelectedUser(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select a user" value={null}/>
                {users.map(user => (
                    <Picker.Item key={user.id} label={`${user.firstName} ${user.lastName}`} value={user.id}/>
                ))}
            </Picker>
            <Button title="Proceed" onPress={handleSelectUser}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    picker: {
        flex: 1,
        height: 40,
        width: '100%',
    },
});

export default InitialScreen;
