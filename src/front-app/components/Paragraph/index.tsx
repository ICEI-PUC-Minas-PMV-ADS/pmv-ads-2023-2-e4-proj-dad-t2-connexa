import React, { memo } from 'react';
import { Text } from 'react-native';
import styles from './styles';

type Props = {
  children: React.ReactNode;
};

const Paragraph = ({ children }: Props) => (
  <Text style={styles.text}>{children}</Text>
);

export default memo(Paragraph);