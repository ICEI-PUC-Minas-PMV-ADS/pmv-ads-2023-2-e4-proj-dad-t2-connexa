import { View, Text } from 'react-native';
import styles from './styles';
import AddParticipant from './AddParticipant';

export default function ExamplePage2() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Página de Exemplo 2</Text>
                <AddParticipant idLista={'15'}/>
            </View>
        </ View>
    );
}