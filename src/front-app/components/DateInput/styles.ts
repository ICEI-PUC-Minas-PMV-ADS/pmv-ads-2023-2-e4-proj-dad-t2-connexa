import { StyleSheet } from 'react-native';
import { theme } from '../../core/theme';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 10,
    },
    input: {
        backgroundColor: theme.colors.surface,
        fontSize: 16,
    },
    error: {
        fontSize: 14,
        color: theme.colors.error,
        paddingHorizontal: 4,
        paddingTop: 4,
    },
  
});

export default styles;
