import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomHeaderProps {
    title: string;
    onCancel: () => void;
    onSave: () => void;
    isModified: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, onCancel, onSave, isModified }) => {
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onCancel}>
                <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onSave} disabled={!isModified}>
                <Text style={[styles.saveButton, !isModified && styles.disabledSave]}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        color: '#007bff',
        fontSize: 16,
    },
    saveButton: {
        color: '#007bff',
        fontSize: 16,
    },
    disabledSave: {
        color: '#aaa',
    },
});

export default CustomHeader;
