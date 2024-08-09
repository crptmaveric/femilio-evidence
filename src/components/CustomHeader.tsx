import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FeButton from "./FeButton";
import {Icon, ListItem} from "react-native-elements";
import { appStyle } from "../theme/AppStyle";
import {Dropdown} from "react-native-element-dropdown";

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
    otherActions?: Array<{ title: string, action: () => void }>; // Nové rekvizity pre iné akcie
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
                                                       iconOnly = false,
                                                       otherActions = []
                                                   }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

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
            <View style={[styles.sideContainer, styles.rightSideContainer]}>
                {onSave && (
                    <FeButton
                        severity={actionSeverity}
                        onPress={onSave}
                        title={saveTitle}
                        disabled={!isModified}
                        containerStyle={{minWidth: 90}}
                        size={'small'}
                    />
                )}
                {otherActions.length > 0 && (
                    <View style={styles.dropdownWrapper}>
                    <Dropdown
                        data={otherActions.map((action, index) => ({
                            label: action.title,
                            value: index,
                        }))}
                        labelField="label"
                        valueField="value"
                        renderRightIcon={() => null}
                        containerStyle={styles.dropdownContainer}
                        placeholderStyle={styles.placeholderStyle}
                        placeholder={
                            <Icon
                                name={"ellipsis-horizontal-circle"}
                                type={"ionicon"}
                                // size={24}
                                color={appStyle.colors.primary['400']}
                            />
                        }
                        onChange={(item) => {
                            otherActions[item.value].action();
                            setDropdownVisible(false);
                        }}
                        style={styles.dropdown}
                        visible={dropdownVisible}
                        onFocus={() => setDropdownVisible(true)}
                        onBlur={() => setDropdownVisible(false)}
                        renderItem={(item) => (
                            <ListItem bottomDivider style={styles.dropdownItem}>
                                <Icon name={'trash-outline'} type={'ionicon'} color={appStyle.colors.danger['400']} />
                                <ListItem.Content>
                                    <ListItem.Title style={{color: appStyle.colors.danger['400']}}>{item.label}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        )}
                    />
                    </View>
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
        width: '100%',
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
    },
    rightSideContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    dropdown: {
        width: 30, // Nastavíme šírku podľa veľkosti ikony
        paddingHorizontal: 0, // Žiadne pridané odsadenie
        marginTop: 10,
        borderRadius: 12,
        shadowRadius: 1.41,
    },
    dropdownContainer: {
        width: 180 ,
        position: 'relative',
        marginTop: 10,
        marginLeft: -150
    },
    dropdownItem: {
        borderRadius: 8,
        shadowRadius: 1.41,
        // padding: 10,
    },
    placeholderStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
        position: 'absolute',
        right: 0,
        // height: 58,

    },
    dropdownWrapper: {
    },
});

export default CustomHeader;
