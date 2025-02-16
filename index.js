import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import LocationMap from './src/screens/map/LocationMap';
AppRegistry.registerComponent(appName, () => LocationMap);
