import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import MerchantScreen from './src/screens/bottom-navs/MerchantScreen';

AppRegistry.registerComponent(appName, () => MerchantScreen);
