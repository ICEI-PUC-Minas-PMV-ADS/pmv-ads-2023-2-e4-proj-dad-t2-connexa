import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Recovery from './pages/Recovery';
import Home from './pages/Home';
import ExamplePage1 from './pages/ExamplePage1';
import ExamplePage2 from './pages/ExamplePage2';
import ExamplePage3 from './pages/ExamplePage3';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(true);

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
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Página Inicial',
            tabBarLabel: 'Início',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="ExamplePage1"
          component={ExamplePage1}
          options={{
            title: 'Página de Exemplo 1',
            tabBarLabel: 'Exemplo 1',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="ExamplePage2"
          component={ExamplePage2}
          options={{
            title: 'Página de Exemplo 2',
            tabBarLabel: 'Exemplo 2',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="ExamplePage3"
          component={ExamplePage3}
          options={{
            title: 'Página de Exemplo 3',
            tabBarLabel: 'Exemplo 3',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
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