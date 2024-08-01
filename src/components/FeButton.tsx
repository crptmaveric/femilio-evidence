import React from 'react';
import {Button, ButtonProps} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import {appStyle} from "../theme/AppStyle";

interface FeButtonProps extends ButtonProps {
    severity: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size?: 'small' | 'medium' | 'large';
}

const FeButton = (props: FeButtonProps) => {
    const {severity,size, ...restProps} = props;

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

    const getButtonSizeStyle = () => {
        switch (size) {
            case 'small':
                return styles.small;
            case 'medium':
                return styles.medium;
            case 'large':
                return styles.large;
            default:
                return styles.medium;
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
            buttonStyle={[styles.container, getButtonStyle(), getButtonSizeStyle()]}
        />
    );
};

const styles = StyleSheet.create({
    icon: {
        margin: appStyle.spacing.s,
    },
    container: {
        paddingVertical: 14,
        paddingHorizontal: appStyle.spacing.m,
    },
    primary: {
        backgroundColor: appStyle.colors.primary['400'],
        borderRadius: 12,
    },
    secondary: {
        backgroundColor: appStyle.colors.primary['50'],
        color: appStyle.colors.primary['400'],
        borderRadius: 12,
    },
    link: {
        backgroundColor: 'transparent',
        // paddingVertical: 0,
        paddingHorizontal: 0,
    },
    danger: {
        backgroundColor: appStyle.colors.danger['500'],
        borderRadius: 12,
    },
    small: {
        borderRadius: 24,
        paddingVertical: appStyle.spacing.s,
    },
    medium: {

    },
    large: {

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
