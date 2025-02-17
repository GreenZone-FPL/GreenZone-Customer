import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ConfirmDeliveryTimeScreen from './src/screens/order/ConfirmDeliveryTimeScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
AppRegistry.registerComponent(appName, () => ConfirmDeliveryTimeScreen);
