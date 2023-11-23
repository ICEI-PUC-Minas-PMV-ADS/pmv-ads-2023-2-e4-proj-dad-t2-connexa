import { StyleSheet } from 'react-native';
import { theme } from '../../core/theme';
import { BorderlessButton } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.secondary
    
  },
  inputTextStyle: {
    color: theme.colors.secondary
  },
  inputError: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.error,
  },
  inputTextStyleError: {
    color: theme.colors.error
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default styles;