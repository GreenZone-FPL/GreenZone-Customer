/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import CheckoutScreen from './src/screens/order/CheckoutScreen';
import TestComponent from './src/components/TestComponent'
AppRegistry.registerComponent(appName, () => CheckoutScreen);
