import { View, Text } from 'react-native';
import styles from './styles';
import AddParticipant from './AddParticipant';
import AddListItem from './AddListItem';

export default function ExamplePage2() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Página de Exemplo 2</Text>
                <AddParticipant idLista={'15'}/>
                <AddListItem idLista={'25'}/>
            </View>
        </ View>
    );
}