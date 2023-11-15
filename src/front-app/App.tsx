import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Recovery from './pages/Recovery';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <PaperProvider>
      {
        isAuthenticated ?
          <AuthenticatedContainer /> :
          <UnauthenticatedContainer />
      }
    </PaperProvider>
  );
}

const AuthenticatedContainer = () => {
  return (
    <NavigationContainer>
    </NavigationContainer>
  );
};

const UnauthenticatedContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" options={{ title: 'Entrar' }} component={Login} />
        <Stack.Screen name="Registration" options={{ title: 'Cadastrar' }} component={Registration} />
        <Stack.Screen name="Recovery" options={{ title: 'Recuperar Senha' }} component={Recovery} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
