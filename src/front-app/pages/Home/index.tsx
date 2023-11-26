import { View, Text } from 'react-native';
import styles from './styles';
import ListaItens from '../../components/List';

export default function Home() {
    return (
        <View style={styles.container}>
          <ListaItens/>
        </ View>
    );
}
