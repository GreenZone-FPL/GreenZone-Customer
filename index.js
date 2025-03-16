import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import SendSMSScreen from './src/screens/auth/SendSMSScreen';
import LoginScreenFake from './src/screens/auth/LoginScreenFake';

AppRegistry.registerComponent(appName, () => App);
