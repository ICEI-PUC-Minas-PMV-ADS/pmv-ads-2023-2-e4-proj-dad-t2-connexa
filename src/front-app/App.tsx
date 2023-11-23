import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useState} from 'react';
import { PaperProvider } from 'react-native-paper';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Recovery from './pages/Recovery';
import Home from './pages/Home';
import CriarLista from './pages/CreateLists/CreateLists';
import ExamplePage2 from './pages/ExamplePage2';
import ExamplePage3 from './pages/ExamplePage3';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { theme } from './core/theme';
import { jwtDecode } from "jwt-decode";
import Toast from './components/Toast';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (accessToken: string) => {
    console.info("App -> handleLogin", accessToken);

    if (!accessToken) {
      setIsAuthenticated(false);
      // Arruma uma lib de tost para nós, bebe.
      // Coloca essa mensagem aqui: Usuário ou senha inválido!
      <Toast type="error" message="Usuário ou senha inválido" />;
     return 
    }

    const decoded = jwtDecode(accessToken);

    console.log("App -> handleLogin", decoded);

    setIsAuthenticated(true);
  };

  const AuthenticatedAreaContainer = () => {
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
            component={CriarLista}
            options={{
              title: 'Crie Uma Nova Lista',
              tabBarLabel: 'Crie Uma Nova Lista1',
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

  const UnauthenticatedAreaContainer = () => {
    return (
      <NavigationContainer>
        <DoAuthenticationStack />
      </NavigationContainer>
    );
  };

  const DoAuthenticationStack = () => {
    return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" options={{ title: 'Entrar' }} >
          {(props) => <Login {...props} handleLogin={handleLogin} />}
        </Stack.Screen>

        <Stack.Screen name="Registration" options={{ title: 'Cadastrar' }} component={Registration} />
        <Stack.Screen name="Recovery" options={{ title: 'Recuperar Senha' }} component={Recovery} />
      </Stack.Navigator>
    );
  };

  return (
    <PaperProvider theme={theme}>
      {
        isAuthenticated ?
          <AuthenticatedAreaContainer /> :
          <UnauthenticatedAreaContainer />
      }
    </PaperProvider>
  );
}