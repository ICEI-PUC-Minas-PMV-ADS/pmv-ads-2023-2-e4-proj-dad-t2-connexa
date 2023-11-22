import React, { memo } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import styles from './styles';

type Props = {
  goBack: () => void;
};

const BackButton = ({ goBack }: Props) => (
  <TouchableOpacity onPress={goBack} style={styles.container}>
    <Image style={styles.image} source={require('../../assets/arrow_back.png')} />
  </TouchableOpacity>
);

export default memo(BackButton);