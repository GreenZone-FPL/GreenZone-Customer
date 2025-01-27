import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ChatScreen from './src/screens/order/ChatScreen';
import TestNotificationScreen from './src/screens/notification/TestNotificationScreen';

AppRegistry.registerComponent(appName, () => TestNotificationScreen);


