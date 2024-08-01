import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FeButton from "./FeButton";

interface CustomHeaderProps {
    title: string;
    onCancel: () => void;
    onSave: () => void;
    isModified: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, onCancel, onSave, isModified }) => {
    return (
        <View style={styles.headerContainer}>
            <FeButton severity={'tertiary'} onPress={onCancel} title={'Close'}/>
            <Text style={styles.title}>{title}</Text>
            <FeButton severity={'primary'} onPress={onSave} title={'Save'} disabled={!isModified} />
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 2,
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
