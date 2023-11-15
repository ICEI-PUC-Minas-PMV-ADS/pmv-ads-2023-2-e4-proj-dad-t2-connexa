import { View, Text } from 'react-native';
import styles from './styles';

export default function Login() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Login</Text>
            </View>
        </ View>
    );
}