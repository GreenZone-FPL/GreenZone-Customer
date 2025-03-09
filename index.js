import {AppRegistry} from 'react-native';
import AppWrapper from './App';
import {name as appName} from './app.json';

import OrderSuccessScreen from './src/screens/shopping/OrderSuccessScreen';
AppRegistry.registerComponent(appName, () => AppWrapper);
