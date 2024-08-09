import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FeButton from "./FeButton";
import {Icon} from "react-native-elements";
import {appStyle} from "../theme/AppStyle";

interface CustomHeaderProps {
    title: string;
    onCancel?: () => void;
    onSave?: () => void;
    isModified?: boolean;
    cancelTitle?: string;
    saveTitle?: string;
    actionSeverity?: 'primary' | 'secondary' | 'tertiary';
    showClose?: boolean;
    showBack?: boolean;
    iconOnly?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
                                                       title,
                                                       onCancel,
                                                       onSave,
                                                       isModified = false,
                                                       saveTitle = 'Save',
                                                       cancelTitle = 'Cancel',
                                                       actionSeverity = 'primary',
                                                       showClose = false,
                                                       showBack = false,
                                                       iconOnly = false
                                                   }) => {
    return (
        <View style={styles.headerContainer}>
            <View style={[styles.sideContainer, styles.leftSideContainer]}>
                {onCancel && (
                    <FeButton
                        severity={'tertiary'}
                        onPress={onCancel}
                        title={!iconOnly ? cancelTitle : ''}
                        icon={
                            showClose || iconOnly ? (
                                <Icon
                                    name={'close-sharp'}
                                    type={'ionicon'}
                                    color={appStyle.colors.primary['400']}
                                />
                            ) : showBack ? (
                                <Icon
                                    name={'chevron-back-sharp'}
                                    type={'ionicon'}
                                    color={appStyle.colors.primary['400']}
                                />
                            ) : null
                        }
                    />
                )}
            </View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.sideContainer}>
                {onSave && (
                    <FeButton
                        severity={actionSeverity}
                        onPress={onSave}
                        title={saveTitle}
                        disabled={!isModified}
                        size={'small'}
                    />
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
        backgroundColor: 'transparent',
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
