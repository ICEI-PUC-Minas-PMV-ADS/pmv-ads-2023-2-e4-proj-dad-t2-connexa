import React, { memo } from 'react';
import { GestureResponderEvent, View } from 'react-native';
import { theme } from '../../core/theme';
import styles from './styles';
import { IconButton } from 'react-native-paper';

type Props = { onPress?: (e: GestureResponderEvent) => void };

const LogoutButton = ({ ...props }: Props) => {
  return (
    <View style={styles.container}>
      <IconButton
        icon="logout"
        iconColor={theme.colors.primary}
        size={25}
        {...props}
      />
    </View>
  );
};

export default memo(LogoutButton);