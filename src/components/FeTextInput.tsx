import React from 'react';
import {ITextProps, Text} from 'native-base';
import {StyleSheet, TextInput} from 'react-native';
import {appStyle} from "../theme/AppStyle";

interface FeTextInputProps extends ITextProps {
    theme?: 'light' | 'dark';
    label?: string | null;
    type: 'single' | 'list';
    error?: boolean,
    multiline?: boolean,
}

const FeTextInput = (props: FeTextInputProps) => {
    const {theme, type,error, multiline, ...restProps} = props;

    const getVariantStyles = () => {
        switch (theme) {
            case 'light':
                return styles.light;
            case 'dark':
                return styles.dark;
            default:
                return styles.light;
        }
    };

    const getTypeStyles = () => {
        switch (type) {
            case 'single':
                return styles.singleInput;
            case 'list':
                return styles.listInput;
            default:
                return styles.singleInput;
        }
    };

    return (
        <>
            {props.label && <Text style={styles.label}>{props.label}</Text>}
            <TextInput
                {...restProps}
                borderRadius={type === 'single' ? appStyle.radius.s : 0}
                multiline={multiline}
                placeholderTextColor={error ? 'red' : appStyle.colors.labels.secondary}
                style={[getVariantStyles(), getTypeStyles()]}
            />
        </>
    );
};

const styles = StyleSheet.create({
    label: {},
    light: {
        borderColor: '#007aff',
        backgroundColor: 'rgba(227,227,228,1)',
        // borderWidth: 2,
        padding: 10,
        // borderRadius: 8,
        color: '#333',
        // selectionColor: '#007aff',
    },
    dark: {
        backgroundColor: '#333',
        padding: 12,
        color: 'white',
        // borderRadius: 8,
        // borderWidth: 0,
        // selectionColor: '#007aff',
    },
    singleInput: {},
    listInput: {
        backgroundColor: 'transparent',
        width: 160,
    },

});

//     <Input
//       variant={'filled'}
//       backgroundColor={'dark.100'}
//       padding={3}
//       size={'lg'}
//       color={'white'}
//       borderRadius={8}
//       borderWidth={0}
//       selectionColor={'primary.500'}
//     />

export default FeTextInput;
