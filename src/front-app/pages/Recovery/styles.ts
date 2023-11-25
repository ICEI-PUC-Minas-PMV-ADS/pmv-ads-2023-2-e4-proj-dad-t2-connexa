import { StyleSheet } from 'react-native';
import { theme } from '../../core/theme';

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1
  },
  container: {
  },
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    marginBottom: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default styles;
