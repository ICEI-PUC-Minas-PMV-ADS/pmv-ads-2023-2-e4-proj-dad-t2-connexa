import { StyleSheet } from 'react-native';
import { theme } from '../../core/theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 14,
    paddingVertical:6,
    
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.secondary,
    paddingHorizontal: 8,
    borderWidth: 0.8,
    borderRadius: 4,
    height: 40,
    color: theme.colors.secondary,

  },
  inputTextStyle: {
    fontSize: 16,
    color: theme.colors.secondary
  },
  inputError: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.error,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderRadius: 4,
    height: 40,
  },
  inputTextStyleError: {
    fontSize: 16,
    color: theme.colors.error
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 12,
  },
});

export default styles;