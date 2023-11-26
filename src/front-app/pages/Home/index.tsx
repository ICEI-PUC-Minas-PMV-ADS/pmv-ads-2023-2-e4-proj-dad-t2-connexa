import { View, Text } from 'react-native';
import styles from './styles';
import ListaItens from '../../components/List';
import { memo } from 'react';

function Home() {
    return (
        <View style={styles.container}>
          <ListaItens/>
        </ View>
    );
}


export default memo(Home)