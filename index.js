/**
 * @format
 */
import LoginScreen from './src/screens/auth/LoginScreen';
import {AppRegistry} from 'react-native';
import App from './App';
import { name as appName } from './app.json';
AppRegistry.registerComponent(appName, () => LoginScreen);
