import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FeButton from "./FeButton";

interface CustomHeaderProps {
    title: string;
    onCancel?: () => void;
    onSave?: () => void;
    isModified?: boolean;
    cancelTitle?: string;
    saveTitle?: string;
    actionSeverity?: 'primary' | 'secondary' | 'tertiary';
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
                                                       title,
                                                       onCancel,
                                                       onSave,
                                                       isModified = false,
                                                       saveTitle = 'Save',
                                                       cancelTitle = 'Cancel',
                                                       actionSeverity = 'primary'
                                                   }) => {
    return (
        <View style={styles.headerContainer}>
            <View style={[styles.sideContainer, styles.leftSideContainer]}>
                {onCancel && (
                    <FeButton severity={'tertiary'} onPress={onCancel} title={cancelTitle} />
                )}
            </View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.sideContainer}>
                {onSave && (
                    <FeButton severity={actionSeverity} onPress={onSave} title={saveTitle} disabled={!isModified} size={'small'} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 0,
        paddingHorizontal: 16,
        position: 'relative',
    },
    title: {
        position: 'absolute',
        left: '44%',
        fontSize: 18,
        fontWeight: 'bold',
    },
    sideContainer: {
        width: '25%', // rezervujeme miesto na tlačidlo
    },
    leftSideContainer: {
        flexDirection: 'row',
    }
});

export default CustomHeader;
