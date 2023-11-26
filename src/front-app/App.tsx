import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
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
import { decode, encode } from 'base-64';
import Toast from 'react-native-toast-message';
import toastConfig from './core/toastConfig';
import JwtPayload from './services/authentication/authentication/dtos/JwtPayloadDto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from './components/LogoutButton';
import { jwtDecode } from 'jwt-decode';
import ListItemsScreen from './pages/ItemLists/ItemLists';
import AddParticipant from './pages/ExamplePage2/AddParticipant';

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    async function fetchToken() {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('userName');
      const birthdate = await AsyncStorage.getItem('birthdate');
      const isAuthenticated = accessToken != null;
      console.info(`App -> useEffect -> fetchToken -> isAuthenticated: ${isAuthenticated} / userId: ${userId} / userName: ${userName} / birthdate: ${birthdate}`);
      setIsAuthenticated(isAuthenticated);
    }

    fetchToken()

  }, []);

  const handleLogin = async (accessToken: string) => {
    if (!accessToken) {
      setIsAuthenticated(false);
      Toast.show({ type: 'error', text1: 'Usuário ou senha inválido.' });
      return
    }

    await storeTokenData(accessToken);
    setIsAuthenticated(true);
    Toast.show({ type: 'success', text1: 'Seja bem-vindo!' });
  };

  const handleLogout = async () => {
    await clearStorage();
    setIsAuthenticated(false);
  };

  const clearStorage = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('birthDate');
  }

  const storeTokenData = async (accessToken: string) => {
    const decodedToken = jwtDecode<JwtPayload>(accessToken);

    console.log("App -> handleLogin", decodedToken);

    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('userId', decodedToken.id);
    await AsyncStorage.setItem('userName', decodedToken.unique_name);
    await AsyncStorage.setItem('birthdate', decodedToken.birthdate);
  }

  const AuthenticatedAreaContainer = () => {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerRight: () => (
              <LogoutButton
                onPress={async () => handleLogout()}
              />
            ),
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              
              title: 'Listas',
              tabBarLabel: 'Início',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Criar Lista"
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
      </NavigationContainer >
    );
  };

  const HomeStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName ='Home'>
          <Stack.Screen name='Home' component={Home} options={{ headerShown: false }}/>
          <Stack.Screen name='ListItemsScreen' component={ListItemsScreen} options={{ headerTitle: '' }}/>
          <Stack.Screen name='AddParticipant' component={AddParticipant} options={{ headerTitle: '' }}/>
        </Stack.Navigator>
    )};

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
        <>
          <AuthenticatedAreaContainer /> 
        </>
          :
          <UnauthenticatedAreaContainer />
      }
      <Toast config={toastConfig} />
    </PaperProvider>
  );
}