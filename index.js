/**
 * @format
 */
import LoginScreen from './src/screens/auth/LoginScreen';
import {AppRegistry} from 'react-native';
import App from './App';
import { name as appName } from './app.json';
<<<<<<< HEAD
AppRegistry.registerComponent(appName, () => LoginScreen);
=======
import CheckoutScreen from './src/screens/order/CheckoutScreen';
AppRegistry.registerComponent(appName, () => App);
>>>>>>> dai/setup-bottom-navigation
