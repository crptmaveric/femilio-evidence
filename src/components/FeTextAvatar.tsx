import {StyleSheet} from 'react-native';
import React from 'react';
import {Avatar} from 'react-native-elements';
import {appStyle} from "../theme/AppStyle";

export const FeTextAvatar = (props: {
  name?: string;
  size?: number;
}) => {

  const getInitials = (name) => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].length >= 2 ? words[0].substring(0, 2).toUpperCase() : words[0].charAt(0).toUpperCase();
    } else {
      const firstInitial = words[0].charAt(0).toUpperCase();
      const secondInitial = words[1].charAt(0).toUpperCase();
      return firstInitial + secondInitial;
    }
  };

  return (
    <>
      <Avatar
        size={props.size ?? 48}
        title={props.name ? getInitials(props.name) : 'Unknown'}
        rounded={true}
        containerStyle={{backgroundColor: appStyle.colors.primary['100']}}
        titleStyle={{color: appStyle.colors.primary['400']}}
      />
    </>
  );
};

const styles = StyleSheet.create({});
