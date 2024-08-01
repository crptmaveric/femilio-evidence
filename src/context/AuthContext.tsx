import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { createTables, getDatabaseConnection, deleteDatabase } from '../database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, ActivityIndicator } from "react-native";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, login: string, email: string, password: string, role: string) => Promise<void>;
    logout: () => void;
    resetDatabase: () => Promise<void>;
}

interface User {
    id: number;
    role: string;
    firstName: string;
    lastName: string;
    login: string;
    email: string;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {},
    register: async () => {},
    logout: () => {},
    resetDatabase: async () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const initialize = async () => {
        try {
            await createTables();
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error('Failed to initialize the database and load user:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initialize();
    }, []);

    const login = async (login: string, password: string) => {
        const db = await getDatabaseConnection();
        const results = await db.executeSql('SELECT * FROM Users WHERE login = ? AND password = ?', [login, password]);

        if (results[0].rows.length > 0) {
            const loggedInUser = results[0].rows.item(0);
            const user = {
                id: loggedInUser.id,
                role: loggedInUser.role,
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                login: loggedInUser.login,
                email: loggedInUser.email
            };
            setUser(user);
            await AsyncStorage.setItem('user', JSON.stringify(user));
        } else {
            throw new Error('Invalid credentials');
        }
    };

    const register = async (firstName: string, lastName: string, login: string, email: string, password: string, role: string) => {
        const db = await getDatabaseConnection();
        await db.executeSql(
            'INSERT INTO Users (firstName, lastName, login, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
            [firstName, lastName, login, email, password, role]
        );
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
    };

    const resetDatabase = async () => {
        await deleteDatabase();
        setUser(null);
        await AsyncStorage.removeItem('user');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, resetDatabase }}>
            {children}
        </AuthContext.Provider>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
