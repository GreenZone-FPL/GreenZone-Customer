import {AppRegistry} from 'react-native';
import AppWrapper from './App';
import {name as appName} from './app.json';
import OrderDetailScreen from './src/screens/order/OrderDetailScreen';
AppRegistry.registerComponent(appName, () => OrderDetailScreen);
