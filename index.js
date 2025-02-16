import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
AppRegistry.registerComponent(appName, () => RegisterScreen);
