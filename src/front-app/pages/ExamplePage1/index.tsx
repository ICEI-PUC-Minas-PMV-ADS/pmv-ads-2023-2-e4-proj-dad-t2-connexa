import { View, Text } from 'react-native';
import styles from './styles';

export default function ExamplePage1() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Página de Exemplo 1</Text>
            </View>
        </ View>
    );
}