import React from 'react';
import {Button, ButtonProps} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import {appStyle} from "../theme/AppStyle";

interface FeButtonProps extends ButtonProps {
    severity: 'primary' | 'secondary' | 'tertiary' | 'danger';
}

const FeButton = (props: FeButtonProps) => {
    const {severity, ...restProps} = props;

    const getButtonStyle = () => {
        switch (severity) {
            case 'primary':
                return styles.primary;
            case 'secondary':
                return styles.secondary;
            case 'tertiary':
                return styles.link;
            case 'danger':
                return styles.danger;
            default:
                return styles.primary;
        }
    };

    const getTitleStyle = () => {
        switch (severity) {
            case 'primary':
                return styles.title_primary;
            case 'secondary':
                return styles.title_secondary;
            case 'tertiary':
                return styles.title_link;
            case 'danger':
                return styles.title_danger;
            default:
                return styles.title_primary;
        }
    };

    return (
        <Button
            minWidth="100%"
            {...props}
            // size={'sm'}
            // borderRadius={8}
            // fontFamily={'body'}
            // fontWeight={'semibold'}
            iconContainerStyle={styles.icon}
            titleStyle={getTitleStyle()}
            buttonStyle={getButtonStyle()}
        />
    );
};

const styles = StyleSheet.create({
    icon: {
        margin: appStyle.spacing.s,
    },
    primary: {
        backgroundColor: appStyle.colors.primary['400'],
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    secondary: {
        backgroundColor: appStyle.colors.primary['50'],
        color: appStyle.colors.primary['400'],
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    link: {
        backgroundColor: 'transparent',
        paddingVertical: 14,
        paddingHorizontal: 8,
    },
    danger: {
        backgroundColor: appStyle.colors.danger['500'],
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    title_primary: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
    },
    title_secondary: {
        color: appStyle.colors.primary['400'],
        fontWeight: '600',
        fontSize: 15,
    },
    title_link: {
        color: appStyle.colors.primary['400'],
        fontWeight: '600',
        fontSize: 15,
    },
    title_danger: {
        color: appStyle.colors.danger['50'],
        fontWeight: '600',
        fontSize: 15,
    },
});

export default FeButton;
